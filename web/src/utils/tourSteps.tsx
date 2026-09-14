import { SelectorParam } from 'i18next'
import React from 'react'

import { getChatName } from 'shared'

import TourStepContent, { ArrowAlignment, TourStepsProps, TourStepType } from '../components/TourStepContent'
import buildConfig from '../constants/buildConfig'
import { HEADER_MENU_ELEMENT_ID, HEADER_MENU_PANEL_ELEMENT_ID } from '../constants/layout'
import getNavigationItems from './navigationItems'

type TourStepId =
  'changeLocation' | 'searchAndLanguage' | 'additionalFeatures' | 'categories' | 'navigation' | 'chat' | 'feedback'

type TourStepDefinition = {
  title: string
  descriptionKey: SelectorParam
}

type TourStepLayout = Omit<TourStepType, 'content'> & {
  id: TourStepId
  descriptionKey?: SelectorParam
}

export const positionBelowElement =
  (arrowAlignment: ArrowAlignment): NonNullable<TourStepType['position']> =>
  ({ left, right, bottom, width, windowWidth }) => {
    const horizontalPosition = arrowAlignment === 'left' ? left : right - width
    // Keeps the popover within the screen for elements close to its edges
    const clampedHorizontalPosition = Math.min(Math.max(horizontalPosition, 0), windowWidth - width)
    return [clampedHorizontalPosition, bottom]
  }

const clickHtmlElement = (element: Element | null): void => {
  if (element instanceof HTMLElement) {
    element.click()
  }
}

const closeHeaderMenu = (element: Element | null): void => {
  if (element instanceof HTMLElement && element.getAttribute('aria-expanded') === 'true') {
    element.click()
  }
}

// Opens the header menu for the duration of the step and highlights the opened menu panel, not the small trigger button
export const headerMenuStep: Pick<TourStepType, 'selector' | 'highlightedSelectors' | 'action' | 'actionAfter'> = {
  selector: `#${HEADER_MENU_ELEMENT_ID}`,
  highlightedSelectors: [`#${HEADER_MENU_PANEL_ELEMENT_ID}`],
  action: clickHtmlElement,
  actionAfter: closeHeaderMenu,
}

const getTourStepDefinitions = ({
  t,
  region,
  languageCode,
}: TourStepsProps): Record<TourStepId, TourStepDefinition | null> => {
  const { appName, featureFlags } = buildConfig()

  return {
    changeLocation: featureFlags.fixedRegion
      ? null
      : {
          title: t($ => $.layout.changeLocation),
          descriptionKey: $ => $.tour.changeLocationDescription,
        },
    searchAndLanguage: {
      title: t($ => $.tour.searchAndLanguageTitle),
      descriptionKey: $ => $.tour.searchAndLanguageDescription,
    },
    additionalFeatures: {
      title: t($ => $.tour.additionalFeaturesTitle),
      descriptionKey: $ => $.tour.additionalFeaturesDescription,
    },
    categories: {
      title: t($ => $.tour.categoriesTitle),
      descriptionKey: $ => $.tour.categoriesDescription,
    },
    navigation: getNavigationItems({ regionModel: region, languageCode })
      ? {
          title: t($ => $.tour.navigationTitle),
          descriptionKey: $ => $.tour.navigationDescription,
        }
      : null,
    chat:
      featureFlags.chat && region.chatEnabled
        ? {
            title: getChatName(appName),
            descriptionKey: $ => $.tour.chatDescription,
          }
        : null,
    feedback: {
      title: t($ => $.feedback.giveFeedback),
      descriptionKey: $ => $.feedback.commentDescription,
    },
  }
}

export const getTourSteps = (props: TourStepsProps, layouts: TourStepLayout[]): TourStepType[] => {
  const definitions = getTourStepDefinitions(props)

  return layouts
    .map(({ id, descriptionKey, ...layout }) => {
      const definition = definitions[id]
      if (!definition) {
        return null
      }

      return {
        ...layout,
        content: (
          <TourStepContent title={definition.title} descriptionKey={descriptionKey ?? definition.descriptionKey} />
        ),
      }
    })
    .filter((step): step is TourStepType => step !== null)
}
