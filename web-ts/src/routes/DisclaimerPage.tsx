
import React, {useContext} from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { CityModel, LanguageModel, DISCLAIMER_ROUTE, PageModel } from 'api-client'
import LocationLayout from '../components/LocationLayout'
import DateFormatterContext from '../context/DateFormatterContext'
import Page from 'src/components/Page'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
  disclaimer: PageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

const DisclaimerPage = ({ match, cityModel, location, disclaimer }: PropsType) => {
  const { languageCode } = match.params
  const dateFormatter = useContext(DateFormatterContext)

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
    <Page
      lastUpdate={disclaimer.lastUpdate}
      title={disclaimer.title}
      content={disclaimer.content}
      formatter={dateFormatter}
      onInternalLinkClick={() => {}}
    />
    </LocationLayout>
  )
}

export default DisclaimerPage