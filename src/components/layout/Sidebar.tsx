import { IconActivity, IconClipboard, IconGrid, IconSettings, IconUsers } from '../icons'
import { useAppState } from "../../state/AppState"
import { useLang } from '../../i18n/LanguageContext'
import type { MessageKey } from '../../i18n/strings'
import type { PageId } from '../../types'

const NAV_ITEMS: { id: PageId; label: string; icon: typeof IconGrid }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: IconGrid },
  { id: 'monitoring', label: 'Live Monitoring', icon: IconActivity },
  { id: 'assessments', label: 'Assessments', icon: IconClipboard },
  { id: 'patients', label: 'Patients', icon: IconUsers },
  { id: 'settings', label: 'Settings', icon: IconSettings },
]

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { page, setPage } = useAppState()
  const { t } = useLang()

  const handleNavigation = (pageId: typeof NAV_ITEMS[number]['id']) => {
    setPage(pageId)
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 861) {
      onClose()
    }
  }

  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="32" height="32">
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path
                d="M10 22c4-8 8-8 12 0"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="10" cy="22" r="2.2" fill="#99F6E4" />
              <circle cx="22" cy="22" r="2.2" fill="#99F6E4" />
              <circle cx="16" cy="10" r="2.4" fill="#fff" />
            </svg>
          </div>
          <div>
            <p className="brand-name">ArthoAI</p>
            <p className="brand-tag">{t('brandTag')}</p>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label={t('mainNav') || 'Main menu'}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = page === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'is-active' : ''}`}
                onClick={() => handleNavigation(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                <span>{t(`nav${item.id.charAt(0).toUpperCase() + item.id.slice(1)}` as MessageKey) || item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-hint">{t('sidebarHelp') || 'Made for local health workers'}</p>
          <p className="sidebar-meta">{t('savedOnDevice') || 'Saved on this device only '}</p>
        </div>
      </aside>
    </>
  )
}
