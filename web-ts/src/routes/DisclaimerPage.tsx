import React, { ReactElement } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { CityModel, LanguageModel, DISCLAIMER_ROUTE } from 'api-client'
import LocationLayout from '../components/LocationLayout'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

const DisclaimerPage = ({ match, cityModel, location }: PropsType): ReactElement => {
  const { languageCode } = match.params

  return (
    <LocationLayout
      cityModel={cityModel}
      viewportSmall={false}
      feedbackTargetInformation={null}
      languageChangePaths={null}
      isLoading={false}
      route={DISCLAIMER_ROUTE}
      languageCode={languageCode}
      pathname={location.pathname}>
      <div>DisclaimerPage</div>
    </LocationLayout>
  )
}

export default DisclaimerPage
