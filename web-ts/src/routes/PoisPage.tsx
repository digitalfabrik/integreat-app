import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { CityModel, LanguageModel, POIS_ROUTE } from 'api-client'
import LocationLayout, { FeedbackRatingType } from '../components/LocationLayout'
import LocationToolbar from '../components/LocationToolbar'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string; poiId?: string }>

const PoisPage = ({ match, cityModel, location }: PropsType) => {
  const { languageCode } = match.params
  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <LocationToolbar openFeedbackModal={openFeedback} viewportSmall={false} />
  )

  return (
    <LocationLayout
      cityModel={cityModel}
      toolbar={toolbar}
      viewportSmall={false}
      feedbackTargetInformation={null}
      languageChangePaths={null}
      isLoading={false}
      route={POIS_ROUTE}
      languageCode={languageCode}
      pathname={location.pathname}>
      <div>PoisPage</div>
    </LocationLayout>
  )
}

export default PoisPage
