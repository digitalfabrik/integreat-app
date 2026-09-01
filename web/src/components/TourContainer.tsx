import { useTheme } from '@mui/material/styles'
import { TourProvider } from '@reactour/tour'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { RegionModel } from 'shared/api'

import { TOUR_MASK_PADDING, TOUR_POPOVER_PADDING } from '../constants/tour'
import useDimensions from '../hooks/useDimensions'
import tourStepsDesktop from '../utils/tourStepsDesktop'
import tourStepsMobile from '../utils/tourStepsMobile'
import TourDialog from './TourDialog'
import TourPopover from './TourPopover'

const HIGHLIGHT_BORDER_RADIUS = 12
const DESKTOP_PADDING = 6
// The highlighted elements are as high as the whole bar and the popover is only placed above or below them
const MOBILE_PADDING = { mask: [TOUR_MASK_PADDING, 0], popover: [0, TOUR_POPOVER_PADDING] }

type TourContainerProps = {
  region: RegionModel
  languageCode: string
}

const TourContainer = ({ region, languageCode }: TourContainerProps): ReactElement => {
  const { t } = useTranslation()
  const { desktop } = useDimensions()
  const { contentDirection } = useTheme()

  const rtl = contentDirection === 'rtl'
  const stepsProps = { t, rtl, region, languageCode }
  const steps = desktop ? tourStepsDesktop(stepsProps) : tourStepsMobile(stepsProps)

  return (
    <TourProvider
      // The provider only reads the steps once, therefore it has to be recreated when switching between the layouts
      key={String(desktop)}
      steps={steps}
      ContentComponent={TourPopover}
      // Only swaps the keyboard arrow keys
      rtl={contentDirection === 'rtl'}
      // Spacing between the highlighted element and the popover
      padding={desktop ? DESKTOP_PADDING : MOBILE_PADDING}
      disableInteraction
      scrollSmooth
      styles={{
        popover: base => ({ ...base, padding: 0, backgroundColor: 'transparent', boxShadow: 'none' }),
        maskArea: base => ({ ...base, rx: HIGHLIGHT_BORDER_RADIUS }),
      }}>
      <TourDialog />
    </TourProvider>
  )
}

export default TourContainer
