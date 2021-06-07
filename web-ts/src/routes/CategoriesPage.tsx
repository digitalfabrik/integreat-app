import React, { ReactElement } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import LocationLayout from '../components/LocationLayout'
import { CATEGORIES_ROUTE, CityModel, LanguageModel } from 'api-client'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string; categoryId?: string }>

const CategoriesPage = ({ cityModel, match, location }: PropsType): ReactElement => {
  const { languageCode } = match.params

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => {
    // TODO IGAPP-640:
    // <CategoriesToolbar
    //   categories={categories}
    //   location={location}
    //   openFeedbackModal={this.openFeedbackModal}
    //   viewportSmall={viewportSmall}
    //   />
    return null
  }

  return (
    <LocationLayout
      cityModel={cityModel}
      toolbar={toolbar}
      viewportSmall={false}
      feedbackTargetInformation={null}
      languageChangePaths={null}
      isLoading={false}
      route={CATEGORIES_ROUTE}
      languageCode={languageCode}
      pathname={location.pathname}>
      <div>CategoriesPage</div>
    </LocationLayout>
  )
}

export default CategoriesPage
