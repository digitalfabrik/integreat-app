import React, { ReactElement } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import LocationLayout, { FeedbackRatingType } from '../components/LocationLayout'
import { CityModel, LanguageModel, OFFERS_ROUTE } from 'api-client'
import LocationToolbar from '../components/LocationToolbar'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

const OffersPage = ({ cityModel, match, location }: PropsType): ReactElement => {
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
      route={OFFERS_ROUTE}
      languageCode={languageCode}
      pathname={location.pathname}>
      <div>OffersPage</div>
    </LocationLayout>
  )
}

export default OffersPage
