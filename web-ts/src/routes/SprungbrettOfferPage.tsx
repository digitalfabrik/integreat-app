import React, { ReactElement } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import LocationLayout from '../components/LocationLayout'
import { CityModel, LanguageModel, SPRUNGBRETT_OFFER_ROUTE } from 'api-client'
import LocationToolbar from '../components/LocationToolbar'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

const SprungbrettOfferPage = ({ cityModel, match, location }: PropsType): ReactElement => {
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
      route={SPRUNGBRETT_OFFER_ROUTE}
      languageCode={languageCode}
      pathname={location.pathname}>
      <div>SprungbrettOfferPage</div>
    </LocationLayout>
  )
}

export default SprungbrettOfferPage
