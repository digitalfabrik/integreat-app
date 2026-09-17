import { Position } from '@reactour/tour'

import { ArrowAlignment } from '../components/base/PopoverPaper'
import {
  CHAT_FAB_ELEMENT_ID,
  HEADER_ACTIONS_ELEMENT_ID,
  HEADER_TITLE_ELEMENT_ID,
  NAVIGATION_TABS_ELEMENT_ID,
  TILES_ELEMENT_ID,
  TOOLBAR_ELEMENT_ID,
} from '../constants/layout'
import { getTourSteps, headerMenuStep, positionBelowElement, TourStepsProps, TourStepType } from './tourSteps'

const tourStepsDesktop = (props: TourStepsProps): TourStepType[] => {
  const { rtl } = props
  const besideElement: Position = rtl ? 'left' : 'right'
  const atStart: ArrowAlignment = rtl ? 'right' : 'left'
  const atEnd: ArrowAlignment = rtl ? 'left' : 'right'

  return getTourSteps(props, [
    {
      id: 'regionChange',
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
      ...headerMenuStep,
      offset: { horizontal: 4, vertical: 24 },
      position: positionBelowElement(atEnd),
      arrowAlignment: atEnd,
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
