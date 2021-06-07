import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { CityModel, LanguageModel, SEARCH_ROUTE } from 'api-client'
import LocationLayout from '../components/LocationLayout'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

const SearchPage = ({ match, cityModel, location }: PropsType) => {
  const { languageCode } = match.params

  return (
    <LocationLayout
      cityModel={cityModel}
      viewportSmall={false}
      feedbackTargetInformation={null}
      languageChangePaths={null}
      isLoading={false}
      route={SEARCH_ROUTE}
      languageCode={languageCode}
      pathname={location.pathname}>
      <div>SearchPage</div>
    </LocationLayout>
  )
}

export default SearchPage
