import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppState } from "./lib/store";
import { DEFAULT_FACILITY_ID } from "./lib/seed";
import { guestUrl } from "./lib/facility";
import { pick, t } from "./lib/i18n";
import { LANGS, type Lang } from "./lib/types";
import { QrImage } from "./components/QrImage";

const LANDING_LANG_KEY = "pd.landing.lang";
const linkButton =
  "rounded-xl px-5 py-3 text-center font-bold transition active:scale-[0.98]";

function readLandingLang(): Lang {
  try {
    const stored = sessionStorage.getItem(LANDING_LANG_KEY);
    return LANGS.find((l) => l.code === stored)?.code ?? "en";
  } catch {
    return "en";
  }
}

function rememberLandingLang(lang: Lang): void {
  try {
    sessionStorage.setItem(LANDING_LANG_KEY, lang);
  } catch {
    // Not remembered across reloads; the page still switches language.
  }
}

export function Landing() {
  const state = useAppState();
  const [lang, setLang] = useState<Lang>(readLandingLang);
  const facility =
    state.facilities.find((f) => f.id === DEFAULT_FACILITY_ID) ??
    state.facilities[0];
  const facilityName = pick(facility.name, lang);

  const handleLang = (next: Lang) => {
    rememberLandingLang(next);
    setLang(next);
  };

  return (
    <>
      <Link
        to="/op"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-5 top-5 z-10 rounded-xl border-2 border-pine-900 bg-card px-4 py-2.5 text-sm font-bold text-pine-900 shadow-sm transition hover:bg-pine-900 hover:text-white active:scale-[0.98]"
      >
        {t(lang, "openOperator")} ↗
      </Link>
      <main
        lang={lang}
        className="mx-auto grid min-h-screen max-w-5xl content-center gap-10 px-6 py-12 lg:grid-cols-[1.2fr_1fr]"
      >
        <section>
          <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-lantern">
            PixelDrive
          </p>
          <h1 className="mt-3 text-5xl font-extrabold leading-[1.1] tracking-tight text-pine-900 sm:text-6xl">
            {t(lang, "landingLine1")}
            <br />
            <span className="text-lantern">{t(lang, "landingLine2")}</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            {t(lang, "landingSub")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/g/${facility.id}?lang=${lang}`}
              className={`${linkButton} bg-lantern-700 text-white shadow-md hover:brightness-110`}
            >
              {t(lang, "openGuest")}
            </Link>
          </div>
        </section>
        <section className="rise-in justify-self-center rounded-[32px] bg-pine-900 p-8 text-center text-white shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lantern">
            {t(lang, "scanAtGate")}
          </p>
          <h2 className="mb-5 mt-1 text-2xl font-extrabold">{facilityName}</h2>
          <div className="inline-block rounded-2xl bg-card p-3">
            <QrImage
              value={guestUrl(facility.id)}
              size={220}
              label={`QR code: ${facilityName}`}
            />
          </div>
          <ul
            className="mt-4 flex flex-wrap justify-center gap-2"
            aria-label="Language"
          >
            {LANGS.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => handleLang(l.code)}
                  aria-pressed={l.code === lang}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    l.code === lang
                      ? "border-lantern bg-lantern-700 text-white"
                      : "border-pine-700 text-pine-100 hover:border-lantern"
                  }`}
                >
                  {l.native}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
