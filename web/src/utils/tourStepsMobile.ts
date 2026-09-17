import { ArrowAlignment } from '../components/base/PopoverPaper'
import {
  BOTTOM_NAVIGATION_ELEMENT_ID,
  CHAT_FAB_ELEMENT_ID,
  HEADER_ACTIONS_ELEMENT_ID,
  HEADER_TITLE_ELEMENT_ID,
  TILES_ELEMENT_ID,
} from '../constants/layout'
import { TOUR_MASK_PADDING, TOUR_POPOVER_PADDING } from '../constants/tour'
import { getTourSteps, headerMenuStep, positionBelowElement, TourStepsProps, TourStepType } from './tourSteps'

const tourStepsMobile = (props: TourStepsProps): TourStepType[] => {
  const { rtl } = props
  const atStart: ArrowAlignment = rtl ? 'right' : 'left'
  const atEnd: ArrowAlignment = rtl ? 'left' : 'right'

  return getTourSteps(props, [
    {
      id: 'regionChange',
      selector: `#${HEADER_TITLE_ELEMENT_ID}`,
      position: positionBelowElement(atStart),
      arrowAlignment: atStart,
      // lowering padding of the mask horizontally
      padding: { mask: [4, 0], popover: [0, TOUR_POPOVER_PADDING] },
    },
    {
      id: 'searchAndLanguage',
      selector: `#${HEADER_ACTIONS_ELEMENT_ID}`,
      position: positionBelowElement(atEnd),
      arrowAlignment: atEnd,
      // Evenly spaced mask around the action buttons
      padding: { mask: TOUR_MASK_PADDING, popover: [0, TOUR_POPOVER_PADDING] },
    },
    {
      id: 'additionalFeatures',
      ...headerMenuStep,
      position: positionBelowElement(atEnd),
      arrowAlignment: atEnd,
      padding: { mask: [0, 0], popover: [0, TOUR_POPOVER_PADDING] },
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
