import { HEADER_MENU_ELEMENT_ID, MAIN_ELEMENT_ID } from '../constants/layout'

// Restore focus after React has removed the tour or its dialog.
const restoreTourFocus = (): void => {
  window.setTimeout(() => {
    const menuButton = document.getElementById(HEADER_MENU_ELEMENT_ID)
    const mainContent = document.getElementById(MAIN_ELEMENT_ID)

    const fallback = mainContent?.querySelector<HTMLElement>('a[href], button:not([disabled])')

    const target = menuButton ?? fallback
    target?.focus()
  }, 0)
}

export default restoreTourFocus
