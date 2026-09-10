import { Position } from '@reactour/tour'

import { ArrowAlignment, TourStepsProps, TourStepType } from '../components/TourStepContent'
import {
  CHAT_FAB_ELEMENT_ID,
  HEADER_ACTIONS_ELEMENT_ID,
  HEADER_MENU_ELEMENT_ID,
  HEADER_MENU_PANEL_ELEMENT_ID,
  HEADER_TITLE_ELEMENT_ID,
  NAVIGATION_TABS_ELEMENT_ID,
  TILES_ELEMENT_ID,
  TOOLBAR_ELEMENT_ID,
} from '../constants/layout'
import { getTourSteps } from './tourSteps'

const positionBelowElement =
  (arrowAlignment: ArrowAlignment): NonNullable<TourStepType['position']> =>
  ({ left, right, bottom, width, windowWidth }) => {
    const horizontalPosition = arrowAlignment === 'left' ? left : right - width
    // Keeps the popover within the screen for elements close to its edges
    const clampedHorizontalPosition = Math.min(Math.max(horizontalPosition, 0), windowWidth - width)
    return [clampedHorizontalPosition, bottom]
  }

const clickHtmlElement = (element: Element | null) => {
  if (element instanceof HTMLElement) {
    element.click()
  }
}

const closeHeaderMenu = (element: Element | null) => {
  if (element instanceof HTMLElement && element.getAttribute('aria-expanded') === 'true') {
    element.click()
  }
}

const tourStepsDesktop = (props: TourStepsProps): TourStepType[] => {
  const { rtl } = props
  const besideElement: Position = rtl ? 'left' : 'right'
  const atStart: ArrowAlignment = rtl ? 'right' : 'left'
  const atEnd: ArrowAlignment = rtl ? 'left' : 'right'

  return getTourSteps(props, [
    {
      id: 'changeLocation',
      offset: { horizontal: -8, vertical: 24 },
      selector: `#${HEADER_TITLE_ELEMENT_ID}`,
      position: positionBelowElement(atStart),
      arrowAlignment: atStart,
    },
    {
      id: 'navigation',
      offset: { horizontal: 8, vertical: 24 },
      selector: `#${NAVIGATION_TABS_ELEMENT_ID}`,
      position: positionBelowElement(atStart),
      arrowAlignment: atStart,
    },
    {
      id: 'categories',
      offset: { horizontal: 24, vertical: 32 },
      selector: `#${TILES_ELEMENT_ID} > :first-child`,
      position: besideElement,
    },
    {
      id: 'searchAndLanguage',
      offset: { horizontal: -16, vertical: 24 },
      selector: `#${HEADER_ACTIONS_ELEMENT_ID}`,
      position: positionBelowElement(atEnd),
      arrowAlignment: atEnd,
    },
    {
      id: 'additionalFeatures',
      offset: { horizontal: 4, vertical: 24 },
      selector: `#${HEADER_MENU_ELEMENT_ID}`,
      // Highlight the opened menu panel, not the small trigger button
      highlightedSelectors: [`#${HEADER_MENU_PANEL_ELEMENT_ID}`],
      position: positionBelowElement(atEnd),
      arrowAlignment: atEnd,
      action: clickHtmlElement,
      actionAfter: closeHeaderMenu,
    },
    {
      id: 'chat',
      offset: { horizontal: -16, vertical: -24 },
      selector: `#${CHAT_FAB_ELEMENT_ID}`,
      position: 'top',
      arrowAlignment: atEnd,
    },
    {
      id: 'feedback',
      offset: { horizontal: 16 },
      selector: `#${TOOLBAR_ELEMENT_ID}`,
      position: besideElement,
    },
  ])
}

export default tourStepsDesktop
