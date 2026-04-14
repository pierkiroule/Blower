(function () {
  'use strict'

  const NAV_STATE_KEY = 'sonarnest.bottomNavState.v1'
  const TAB_PATH_KEY = 'sonarnest.bottomNavTabPaths.v1'
  const SCROLL_KEY = 'sonarnest.bottomNavScroll.v1'

  const TABS = [
    { id: 'home', label: 'Home', href: './home.html', icon: 'home' },
    { id: 'sonarnest', label: 'SonarNest', href: './index.html', icon: 'sonar' },
    { id: 'store', label: 'Store', href: './config.html', icon: 'store' },
    { id: 'profil', label: 'Profil', href: './profil.html', icon: 'profil' }
  ]

  function safeRead(key, fallback) {
    try {
      return JSON.parse(window.sessionStorage.getItem(key) || '') || fallback
    } catch (_error) {
      return fallback
    }
  }

  function safeWrite(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (_error) {}
  }

  function iconSvg(name) {
    if (name === 'home') return '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-5h-4v5H5a1 1 0 0 1-1-1v-9.5Z"/>'
    if (name === 'store') return '<path d="M3 8h18l-1.4 12.2a1 1 0 0 1-1 .8H5.4a1 1 0 0 1-1-.8L3 8Zm2.2-4h13.6l1.1 3H4.1l1.1-3ZM9 11v6m6-6v6"/>'
    if (name === 'profil') return '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"/>'
    return '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Zm8.5-.8L8.6 8.5v7L12 17.3l3.4-1.8v-7L12 6.7Z"/>'
  }

  function resolveTabPathMap() {
    return safeRead(TAB_PATH_KEY, {})
  }

  function initBottomNav() {
    const activeTab = document.body.dataset.bottomNavTab || 'home'
    const path = window.location.pathname
    const tabPaths = resolveTabPathMap()
    tabPaths[activeTab] = path
    safeWrite(TAB_PATH_KEY, tabPaths)
    safeWrite(NAV_STATE_KEY, { activeTab })

    const nav = document.createElement('nav')
    nav.className = 'bottom-nav'
    nav.setAttribute('aria-label', 'Navigation principale')

    nav.innerHTML = TABS.map((tab) => {
      const isActive = tab.id === activeTab
      return `
        <a href="${tab.href}" class="bottom-nav__item${isActive ? ' is-active' : ''}" data-tab-id="${tab.id}">
          <span class="bottom-nav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              ${iconSvg(tab.icon)}
            </svg>
          </span>
          <span class="bottom-nav__label">${tab.label}</span>
        </a>
      `
    }).join('')

    document.body.appendChild(nav)
    document.body.classList.add('has-bottom-nav')

    const styles = document.createElement('style')
    styles.textContent = `
      :root { --bottom-nav-base-height: 64px; }
      .has-bottom-nav { padding-bottom: calc(var(--bottom-nav-base-height) + env(safe-area-inset-bottom)); }
      .bottom-nav {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: calc(var(--bottom-nav-base-height) + env(safe-area-inset-bottom));
        padding-bottom: env(safe-area-inset-bottom);
        border-top: 1px solid rgba(255,255,255,0.18);
        background: rgba(8, 11, 22, 0.94);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        z-index: 120;
      }
      .bottom-nav__item {
        min-height: 64px;
        display: grid;
        place-content: center;
        gap: 3px;
        text-decoration: none;
        color: rgba(231, 240, 255, 0.58);
        transition: color 180ms ease, transform 180ms ease;
      }
      .bottom-nav__icon svg { width: 24px; height: 24px; }
      .bottom-nav__label {
        font-size: 12px;
        line-height: 1;
        font-weight: 600;
        letter-spacing: 0.01em;
      }
      .bottom-nav__item.is-active {
        color: #7fd5ff;
        transform: translateY(-1px);
      }
      .bottom-nav__item:active { transform: translateY(0); }
    `
    document.head.appendChild(styles)

    const scrollState = safeRead(SCROLL_KEY, {})
    const currentPath = window.location.pathname
    if (typeof scrollState[currentPath] === 'number') {
      window.requestAnimationFrame(() => window.scrollTo(0, scrollState[currentPath]))
    }

    for (const link of nav.querySelectorAll('.bottom-nav__item')) {
      link.addEventListener('click', (event) => {
        const selectedTab = link.dataset.tabId
        const state = resolveTabPathMap()
        const perTabTarget = state[selectedTab]

        const scrollMap = safeRead(SCROLL_KEY, {})
        scrollMap[currentPath] = window.scrollY
        safeWrite(SCROLL_KEY, scrollMap)

        safeWrite(NAV_STATE_KEY, { activeTab: selectedTab })

        if (perTabTarget && perTabTarget !== currentPath) {
          event.preventDefault()
          window.location.href = perTabTarget
        }
      })
    }
  }

  window.SonarNestUI = Object.assign({}, window.SonarNestUI, {
    initBottomNav
  })
})()
