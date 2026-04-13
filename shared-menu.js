(function () {
  'use strict'

  function initBurgerMenu(options) {
    const buttonId = options && options.buttonId ? options.buttonId : 'menuBtn'
    const menuId = options && options.menuId ? options.menuId : 'mainMenu'

    const menuBtn = document.getElementById(buttonId)
    const menu = document.getElementById(menuId)
    if (!menuBtn || !menu) return null

    function closeMenu() {
      menu.hidden = true
      menuBtn.setAttribute('aria-expanded', 'false')
    }

    function toggleMenu() {
      const shouldOpen = menu.hidden
      menu.hidden = !shouldOpen
      menuBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false')
    }

    menuBtn.addEventListener('click', (event) => {
      event.stopPropagation()
      toggleMenu()
    })

    window.addEventListener('pointerdown', (event) => {
      if (menu.hidden) return
      if (menu.contains(event.target) || menuBtn.contains(event.target)) return
      closeMenu()
    })

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu()
    })

    for (const link of menu.querySelectorAll('a')) {
      link.addEventListener('click', closeMenu)
    }

    return { closeMenu }
  }

  window.SonarNestUI = Object.assign({}, window.SonarNestUI, {
    initBurgerMenu
  })
})()
