import { IconBell, IconMenu, IconPlus } from '../icons'
import { useLang } from '../../i18n/LanguageContext'

type TopBarProps = {
  onMenu: () => void
  onNewAssessment?: () => void
}

export function TopBar({ onMenu, onNewAssessment }: TopBarProps) {
  const { t, lang, setLang } = useLang()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="icon-btn menu-btn" onClick={onMenu} aria-label={t('openMenu') || 'Open menu'}>
          <IconMenu />
        </button>
        <div>
          <p className="eyebrow">NavDristi</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="topbar-actions">
        <button type="button" className="icon-btn" aria-label={t('language') || 'Language'}>
          <IconBell />
        </button>
        
        {/* Simple language toggle in header */}
        <div className="topbar-language">
          <button 
            type="button" 
            className="lang-toggle-btn" 
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            aria-label={t('language') || 'Switch language'}
          >
            {lang === 'en' ? 'हिन्दी' : 'English'}
          </button>
        </div>

        <button type="button" className="btn-primary" onClick={onNewAssessment}>
          <IconPlus size={18} />
          {t('addPatient') || 'Add Patient'}
        </button>
      </div>
    </header>
  )
}
