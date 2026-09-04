import { Position } from '@reactour/tour'
import React from 'react'

import { getChatName } from 'shared'

import TourStepContent, { ArrowAlignment, TourStepsProps, TourStepType } from '../components/TourStepContent'
import buildConfig from '../constants/buildConfig'
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
import getNavigationItems from './navigationItems'

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

const tourStepsDesktop = ({ t, rtl, region, languageCode }: TourStepsProps): TourStepType[] => {
  const { appName, featureFlags } = buildConfig()
  const besideElement: Position = rtl ? 'left' : 'right'
  const atStart: ArrowAlignment = rtl ? 'right' : 'left'
  const atEnd: ArrowAlignment = rtl ? 'left' : 'right'

  const steps: (TourStepType | null)[] = [
    featureFlags.fixedRegion
      ? null
      : {
          offset: { horizontal: -8, vertical: 24 },
          selector: `#${HEADER_TITLE_ELEMENT_ID}`,
          position: positionBelowElement(atStart),
          arrowAlignment: atStart,
          content: (
            <TourStepContent
              title={t($ => $.layout.changeLocation)}
              descriptionKey={$ => $.tour.changeLocationDescription}
            />
          ),
        },
    getNavigationItems({ regionModel: region, languageCode })
      ? {
          offset: { horizontal: 8, vertical: 24 },
          selector: `#${NAVIGATION_TABS_ELEMENT_ID}`,
          position: positionBelowElement(atStart),
          arrowAlignment: atStart,
          content: (
            <TourStepContent
              title={t($ => $.tour.navigationTitle)}
              descriptionKey={$ => $.tour.navigationDescription}
            />
          ),
        }
      : null,
    {
      offset: { horizontal: 24, vertical: 32 },
      selector: `#${TILES_ELEMENT_ID} > :first-child`,
      position: besideElement,
      content: (
        <TourStepContent title={t($ => $.tour.categoriesTitle)} descriptionKey={$ => $.tour.categoriesDescription} />
      ),
    },
    {
      offset: { horizontal: -16, vertical: 24 },
      selector: `#${HEADER_ACTIONS_ELEMENT_ID}`,
      position: positionBelowElement(atEnd),
      arrowAlignment: atEnd,
      content: (
        <TourStepContent
          title={t($ => $.tour.searchAndLanguageTitle)}
          descriptionKey={$ => $.tour.searchAndLanguageDescription}
        />
      ),
    },
    {
      offset: { horizontal: 4, vertical: 24 },
      selector: `#${HEADER_MENU_ELEMENT_ID}`,
      // Highlight the opened menu panel, not the small trigger button
      highlightedSelectors: [`#${HEADER_MENU_PANEL_ELEMENT_ID}`],
      position: positionBelowElement(atEnd),
      arrowAlignment: atEnd,
      action: clickHtmlElement,
      actionAfter: closeHeaderMenu,
      content: (
        <TourStepContent
          title={t($ => $.tour.additionalFeaturesTitle)}
          descriptionKey={$ => $.tour.additionalFeaturesDescription}
        />
      ),
    },
    featureFlags.chat && region.chatEnabled
      ? {
          offset: { horizontal: -16, vertical: -24 },
          selector: `#${CHAT_FAB_ELEMENT_ID}`,
          position: 'top',
          arrowAlignment: atEnd,
          content: <TourStepContent title={getChatName(appName)} descriptionKey={$ => $.tour.chatDescription} />,
        }
      : null,
    {
      offset: { horizontal: 16 },
      selector: `#${TOOLBAR_ELEMENT_ID}`,
      position: besideElement,
      content: (
        <TourStepContent title={t($ => $.feedback.giveFeedback)} descriptionKey={$ => $.tour.feedbackDescription} />
      ),
    },
  ]

  return steps.filter((step): step is TourStepType => step !== null)
}

export default tourStepsDesktop
