"""Browser acceptance against real assets; all conversation traffic is synthetic."""
import json
import os
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

LIVE = os.environ.get("LIVE") == "1"
OUT = Path(os.environ.get("LAUNCHER_SMOKE_OUTPUT", "/tmp/aihub-launcher-smoke")) / ("live-browser" if LIVE else "local-browser")
OUT.mkdir(exist_ok=True)
reports = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    cases = [("aihub", 1440, "no-preference"), ("aihub", 390, "no-preference"),
             ("aihub", 320, "reduce")]
    if not LIVE:
        cases += [("classic", 1440, "no-preference"), ("unknown", 390, "no-preference"),
                  ("api-fail", 1440, "no-preference"), ("asset-fail", 1440, "no-preference"),
                  ("frame-fail", 390, "no-preference")]
    for variant, width, motion in cases:
        ctx = browser.new_context(viewport={"width": width, "height": 844}, reduced_motion=motion)
        errors, conversations, bootstrap = [], [], []
        if not LIVE:
            def site(route):
                parts = urlsplit(route.request.url)
                route.fulfill(response=route.fetch(url="http://127.0.0.1:4188" + parts.path + ("?" + parts.query if parts.query else "")))
            ctx.route("https://aihub.works/**", site)
        def crm(route):
            path = urlsplit(route.request.url).path
            if path == "/api/knowledge/widget_launcher":
                bootstrap.append({"method":route.request.method,"cookie":route.request.headers.get("cookie")})
                if not LIVE:
                    skin = "aihub" if variant in {"aihub", "asset-fail", "frame-fail"} else variant
                    route.fulfill(status=503 if variant == "api-fail" else 200,
                        content_type="application/json", body=json.dumps({"launcher_skin":skin}),
                        headers={"Access-Control-Allow-Origin":"*", "Cache-Control":"no-store"})
                    return
            if path.startswith("/api/chats/"):
                conversations.append(path)
                payload = {"chat_id":"launcher-synthetic"} if path == "/api/chats/get_chat" else {"commands":[]}
                route.fulfill(status=200, content_type="application/json", body=json.dumps(payload))
                return
            if path == "/api/knowledge/bot_info" and not LIVE:
                route.fulfill(status=200,content_type="application/json",body='{"chat_skin":"aihub","app_name":"AIHUB"}')
                return
            if variant == "asset-fail" and path.endswith("egg-sprite.png"):
                route.abort()
                return
            if variant == "frame-fail" and path == "/chats/chat/":
                route.abort()
                return
            if path.startswith("/api/") and path not in {"/api/knowledge/widget_launcher", "/api/knowledge/bot_info"}:
                route.fulfill(status=503, body="{}")
                return
            if LIVE:
                route.continue_()
            else:
                parts = urlsplit(route.request.url)
                route.fulfill(response=route.fetch(url="http://127.0.0.1:18089" + parts.path + ("?" + parts.query if parts.query else "")))
        ctx.route("https://aihubworks.com/**", crm)
        ctx.route("https://telegram.org/**", lambda r:r.abort())
        ctx.route("https://cdn.jsdelivr.net/**", lambda r:r.fulfill(status=200,
            content_type="application/json" if r.request.url.endswith(".json") else "text/css",
            body=json.dumps([{"annotation":"smile","emoji":"\U0001f600","group":0,"order":1,"tags":["smile"],"version":1}]) if r.request.url.endswith(".json") else "",
            headers={"etag":'"launcher-smoke"'}))
        ctx.route_web_socket("**/*", lambda ws: ws.on_message(lambda raw:
            ws.send('{"type":"get_messages","messages":[]}') if json.loads(raw).get("type") == "get_messages" else None))
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        if os.environ.get("DEBUG") == "1":
            page.on("console", lambda message: print("BROWSER", message.type, message.text, flush=True))
            page.on("requestfailed", lambda request: print("FAILED", request.url, request.failure, flush=True))
            page.on("response", lambda response: print("ASSET", response.status, response.url, flush=True) if "/widget-launcher/" in response.url or "/widget_launcher" in response.url else None)
        page.goto("https://aihub.works/?lang=ru#services", wait_until="domcontentloaded")
        button = page.locator(".aihub-chat-activate")
        button.wait_for()
        fallback = variant in {"api-fail", "asset-fail"}
        if fallback:
            page.wait_for_timeout(5500)
            assert button.locator(".aihub-chat-activate__egg").count() == 1
        else:
            art = button.locator(".crm-launcher-art")
            art.wait_for(timeout=15000)
            selected = "aihub" if variant in {"aihub", "frame-fail"} else "classic"
            assert art.get_attribute("data-launcher-skin") == selected
            if selected == "aihub" and motion != "reduce":
                expected = [1,0,1,0,3,2,3,2,3,2,1]
                times = [150,1150,2150,3150,4150,4650,5150,5650,6150,6650,7150]
                for t, frame in zip(times, expected):
                    position = art.evaluate("(el,t)=>{const a=el.getAnimations()[0];a.pause();a.currentTime=t;return parseFloat(getComputedStyle(el).backgroundPositionX);}", t)
                    assert abs(position - frame * 100/3) < .01, (t,position,frame)
                    if width == 1440 and t in {150,1150,4150,4650}:
                        button.screenshot(path=str(OUT / f"frame-{t}.png"))
            elif selected == "aihub":
                assert art.evaluate("el => getComputedStyle(el).animationName") == "none"
        assert bootstrap and all(row["method"] == "GET" and not row["cookie"] for row in bootstrap)
        assert not conversations, "The launcher must not create a conversation before click"
        box = button.bounding_box()
        assert box and box["x"] >= 0 and box["y"] >= 0 and box["x"] + box["width"] <= width
        page.screenshot(path=str(OUT / f"{variant}-{width}-{motion}.png"))
        button.focus()
        page.keyboard.press("Enter")
        if variant == "frame-fail":
            page.locator(".aihub-chat-activate--unavailable").wait_for(timeout=12000)
            assert not button.is_disabled()
            assert button.locator(".crm-launcher-art").is_hidden()
            assert button.locator(".aihub-chat-activate__status").is_visible()
        else:
            iframe = page.locator(".aihub-chat-frame")
            iframe.wait_for(state="visible", timeout=20000)
            frame = page.frame_locator(".aihub-chat-frame")
            frame.locator(".aihub-header").wait_for()
            assert iframe.evaluate("el => getComputedStyle(el).borderRadius") == ("30px" if width >= 768 else "0px")
            visitor = iframe.get_attribute("src")
            frame.locator("button:has(.pi-times)").click()
            iframe.wait_for(state="detached")
            assert button.is_visible() and page.evaluate("document.activeElement === document.querySelector('.aihub-chat-activate')")
            button.click()
            iframe.wait_for(state="visible")
            assert iframe.get_attribute("src") == visitor
            frame.locator("button:has(.pi-times)").click()
        assert len(ctx.pages) == 1 and not errors, errors
        reports.append({"variant":variant,"width":width,"motion":motion,"passed":True})
        print("LAUNCHER_SITE_OK " + json.dumps(reports[-1]), flush=True)
        ctx.close()
    browser.close()
(OUT / "report.json").write_text(json.dumps(reports,indent=2)+"\n")
