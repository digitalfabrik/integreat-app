import { SelectorParam } from 'i18next'
import React from 'react'

import { getChatName } from 'shared'

import TourStepContent, { TourStepsProps, TourStepType } from '../components/TourStepContent'
import buildConfig from '../constants/buildConfig'
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
