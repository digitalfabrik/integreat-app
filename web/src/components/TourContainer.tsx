import { useTheme } from '@mui/material/styles'
import { TourProvider } from '@reactour/tour'
import React, { ReactElement } from 'react'

import { RegionModel } from 'shared/api'

import { TOUR_MASK_PADDING, TOUR_POPOVER_PADDING } from '../constants/tour'
import useDimensions from '../hooks/useDimensions'
import useTourSteps from '../hooks/useTourSteps'
import TourDialog from './TourDialog'
import TourPopover from './TourPopover'

const HIGHLIGHT_BORDER_RADIUS = 12

type TourContainerProps = {
  region: RegionModel
  languageCode: string
}

const TourContainer = ({ region, languageCode }: TourContainerProps): ReactElement => {
  const { desktop } = useDimensions()
  const { contentDirection } = useTheme()
  const steps = useTourSteps({ region, languageCode, desktop })

  return (
    <TourProvider
      // The provider only reads the steps once, therefore it has to be recreated when switching between the layouts
      key={String(desktop)}
      steps={steps}
      ContentComponent={TourPopover}
      // Only swaps the keyboard arrow keys
      rtl={contentDirection === 'rtl'}
      padding={{
        popover: desktop ? TOUR_POPOVER_PADDING : [0, TOUR_POPOVER_PADDING],
      }}
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
