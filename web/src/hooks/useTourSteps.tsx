import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

import { RegionModel } from 'shared/api'

import { TourStepType } from '../components/TourStepContent'
import tourStepsDesktop from '../utils/tourStepsDesktop'
import tourStepsMobile from '../utils/tourStepsMobile'

type UseTourStepsProps = {
  region: RegionModel
  languageCode: string
  desktop: boolean
}

const useTourSteps = ({ region, languageCode, desktop }: UseTourStepsProps): TourStepType[] => {
  const { t } = useTranslation('tour')
  const { contentDirection } = useTheme()

  const props = { t, rtl: contentDirection === 'rtl', region, languageCode }
  return desktop ? tourStepsDesktop(props) : tourStepsMobile(props)
}

export default useTourSteps
