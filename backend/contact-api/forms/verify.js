import { createBotCheck, FormError } from "./security.js";

const action = process.argv[2];
if (!["contact_submit", "shop_submit"].includes(action)) {
  console.error(
    "Usage: npm run forms:verify -- contact_submit|shop_submit < private-token-file",
  );
  process.exitCode = 2;
} else {
  try {
    const checker = createBotCheck({
      required: true,
      secretKey: process.env.TURNSTILE_SECRET_KEY || "",
      hostnames: (process.env.TURNSTILE_ALLOWED_HOSTNAMES || "")
        .split(",")
        .map((host) => host.trim())
        .filter(Boolean),
    });
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk.toString("utf8");
      if (Buffer.byteLength(input) > 2050)
        throw new FormError(403, "BOT_CHECK_FAILED");
    }
    await checker.verify(input.trim(), action);
    console.log(JSON.stringify({ ok: true, action }));
  } catch (error) {
    console.error(
      JSON.stringify({
        ok: false,
        code: error instanceof FormError ? error.code : "CONFIGURATION_ERROR",
      }),
    );
    process.exitCode = 1;
  }
}
