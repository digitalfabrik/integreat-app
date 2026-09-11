import { ArrowAlignment, TourStepsProps, TourStepType } from '../components/TourStepContent'
import {
  BOTTOM_NAVIGATION_ELEMENT_ID,
  CHAT_FAB_ELEMENT_ID,
  HEADER_ELEMENT_ID,
  TILES_ELEMENT_ID,
} from '../constants/layout'
import { TOUR_MASK_PADDING, TOUR_POPOVER_PADDING } from '../constants/tour'
import { getTourSteps } from './tourSteps'

const HEADER_POPOVER_POSITIONS = { changeLocation: 0.4, searchAndLanguage: 0.6, additionalFeatures: 1 }

const tourStepsMobile = (props: TourStepsProps): TourStepType[] => {
  const { rtl } = props
  const atEnd: ArrowAlignment = rtl ? 'left' : 'right'

  const headerStep = (
    arrowAlignment: ArrowAlignment,
    popoverPosition: number,
  ): Pick<TourStepType, 'selector' | 'position' | 'arrowAlignment'> => ({
    selector: `#${HEADER_ELEMENT_ID}`,
    arrowAlignment,
    position: ({ width, windowWidth, bottom }) => {
      const position = rtl ? 1 - popoverPosition : popoverPosition
      return [(windowWidth - width) * position, bottom]
    },
  })

  return getTourSteps(props, [
    {
      id: 'changeLocation',
      ...headerStep(rtl ? 'right' : 'left', HEADER_POPOVER_POSITIONS.changeLocation),
    },
    {
      id: 'searchAndLanguage',
      ...headerStep(atEnd, HEADER_POPOVER_POSITIONS.searchAndLanguage),
    },
    {
      id: 'additionalFeatures',
      ...headerStep(atEnd, HEADER_POPOVER_POSITIONS.additionalFeatures),
      descriptionKey: $ => $.tour.additionalFeaturesWithFeedbackDescription,
    },
    {
      id: 'categories',
      selector: `#${TILES_ELEMENT_ID} > :first-child`,
      position: 'bottom',
    },
    {
      id: 'navigation',
      selector: `#${BOTTOM_NAVIGATION_ELEMENT_ID}`,
      position: 'top',
    },
    {
      id: 'chat',
      selector: `#${CHAT_FAB_ELEMENT_ID}`,
      position: 'top',
      arrowAlignment: atEnd,
      // Rounded mask for chat button
      padding: { mask: TOUR_MASK_PADDING, popover: [0, TOUR_POPOVER_PADDING] },
      styles: { maskArea: base => ({ ...base, rx: base.width / 2 }) },
    },
  ])
}

export default tourStepsMobile
