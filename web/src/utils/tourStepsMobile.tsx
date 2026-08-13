import React from 'react'

import { getChatName } from 'shared'

import TourStepContent, { ArrowAlignment, TourStepsProps, TourStepType } from '../components/TourStepContent'
import buildConfig from '../constants/buildConfig'
import {
  BOTTOM_NAVIGATION_ELEMENT_ID,
  CHAT_FAB_ELEMENT_ID,
  HEADER_ELEMENT_ID,
  TILES_ELEMENT_ID,
} from '../constants/layout'
import { TOUR_MASK_PADDING, TOUR_POPOVER_PADDING } from '../constants/tour'
import getNavigationItems from './navigationItems'

const HEADER_PADDING: TourStepType['padding'] = {
  mask: [TOUR_MASK_PADDING, 0],
  popover: [0, TOUR_POPOVER_PADDING],
}

const HEADER_POPOVER_POSITIONS = { changeLocation: 0.4, searchAndLanguage: 0.6, additionalFeatures: 1 }

const tourStepsMobile = ({ t, rtl, region, languageCode }: TourStepsProps): TourStepType[] => {
  const { appName, featureFlags } = buildConfig()
  const atEnd = rtl ? 'left' : 'right'

  const headerStep = (
    arrowAlignment: ArrowAlignment,
    popoverPosition: number,
  ): Pick<TourStepType, 'selector' | 'position' | 'arrowAlignment' | 'padding'> => ({
    selector: `#${HEADER_ELEMENT_ID}`,
    arrowAlignment,
    padding: HEADER_PADDING,
    position: ({ width, windowWidth, bottom }) => {
      const position = rtl ? 1 - popoverPosition : popoverPosition
      return [(windowWidth - width) * position, bottom]
    },
  })

  const steps: (TourStepType | null)[] = [
    featureFlags.fixedRegion
      ? null
      : {
          ...headerStep(rtl ? 'right' : 'left', HEADER_POPOVER_POSITIONS.changeLocation),
          content: <TourStepContent title={t('changeLocationTitle')} descriptionKey='changeLocationDescription' />,
        },
    {
      ...headerStep(atEnd, HEADER_POPOVER_POSITIONS.searchAndLanguage),
      content: <TourStepContent title={t('searchAndLanguageTitle')} descriptionKey='searchAndLanguageDescription' />,
    },
    {
      ...headerStep(atEnd, HEADER_POPOVER_POSITIONS.additionalFeatures),
      content: (
        <TourStepContent
          title={t('additionalFeaturesTitle')}
          descriptionKey='additionalFeaturesWithFeedbackDescription'
        />
      ),
    },
    {
      selector: `#${TILES_ELEMENT_ID} > :first-child`,
      position: 'bottom',
      content: <TourStepContent title={t('categoriesTitle')} descriptionKey='categoriesDescription' />,
    },
    getNavigationItems({ regionModel: region, languageCode })
      ? {
          selector: `#${BOTTOM_NAVIGATION_ELEMENT_ID}`,
          position: 'top',
          content: <TourStepContent title={t('navigationTitle')} descriptionKey='navigationDescription' />,
        }
      : null,
    featureFlags.chat && region.chatEnabled
      ? {
          selector: `#${CHAT_FAB_ELEMENT_ID}`,
          position: 'top',
          arrowAlignment: atEnd,
          content: <TourStepContent title={getChatName(appName)} descriptionKey='chatDescription' />,
        }
      : null,
  ]

  return steps.filter((step): step is TourStepType => step !== null)
}

export default tourStepsMobile
