import { NavLink, PageContainer } from "../design-system";
import { SiteLogo } from "../components/SiteHeader";
import { CompanyDetails } from "../components/CompanyDetails";
import { copy } from "./data";
import type { ShopLanguage } from "./data";

const base = import.meta.env.BASE_URL;

export function ShopFooter({ lang }: { lang: ShopLanguage }) {
  const t = copy[lang];
  return (
    <footer className="shop-footer">
      <PageContainer>
        <div className="shop-footer-top">
          <div>
            <SiteLogo lang={lang} />
            <p>{t.footerLine}</p>
          </div>
          <NavLink href="mailto:techcrew@aihub.works">
            techcrew@aihub.works <span aria-hidden="true">→</span>
          </NavLink>
        </div>
        <CompanyDetails lang={lang} />
        <div className="shop-footer-bottom">
          <span>© {new Date().getFullYear()} AIHUB</span>
          <NavLink href={`${base}legal/privacy-policy.html?lang=${lang}`}>
            {t.privacy}
          </NavLink>
          <NavLink href={`${base}legal/terms.html?lang=${lang}`}>
            {t.terms}
          </NavLink>
          <NavLink href="#top">{t.top} ↑</NavLink>
        </div>
      </PageContainer>
    </footer>
  );
}
