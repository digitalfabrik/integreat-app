import React, { ReactElement } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import LocationLayout, { FeedbackRatingType } from '../../components/LocationLayout'
import { EVENTS_ROUTE, CityModel, LanguageModel } from 'api-client'
import LocationToolbar from '../../components/LocationToolbar'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string; eventId?: string }>

const EventsPage = ({ cityModel, match }: PropsType): ReactElement => {
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
      routeType={EVENTS_ROUTE}
      languageCode={languageCode}
      pathname={location.pathname}>
      <div>EventsPage</div>
    </LocationLayout>
  )
}

export default EventsPage
