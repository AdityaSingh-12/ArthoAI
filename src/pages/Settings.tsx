import { useLang } from '../i18n/LanguageContext'

export function Settings() {
  const { t, lang, setLang } = useLang()

  return (
    <>
      <section className="panel">
        <h2>{t('language')}</h2>
        <p className="panel-sub settings-copy">{t('langEnglish')} / {t('langHindi')}</p>
        <div className="lang-toggle large" role="group" aria-label={t('language')}>
          <button type="button" className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>
            {t('langEnglish')}
          </button>
          <button type="button" className={lang === 'hi' ? 'is-active' : ''} onClick={() => setLang('hi')}>
            {t('langHindi')}
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>{t('aboutTitle')}</h2>
        <p className="about-text">{t('aboutBody')}</p>
        <p className="muted">{t('savedOnDevice')}</p>
      </section>
    </>
  )
}
