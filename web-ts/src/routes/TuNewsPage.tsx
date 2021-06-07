import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { CityModel, LanguageModel, TU_NEWS_TYPE } from 'api-client'
import LocationLayout, { FeedbackRatingType } from '../components/LocationLayout'
import LocationToolbar from '../components/LocationToolbar'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string; newsId?: string }>

const TuNewsPage = ({ match, cityModel, location }: PropsType) => {
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
      routeType={TU_NEWS_TYPE}
      languageCode={languageCode}
      pathname={location.pathname}>
      <div>TuNewsPage</div>
    </LocationLayout>
  )
}

export default TuNewsPage
