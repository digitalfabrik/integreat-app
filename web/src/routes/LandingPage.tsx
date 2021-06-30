import React, { ReactElement } from 'react'
import { CityModel } from 'api-client'
import { RouteComponentProps } from 'react-router-dom'
import FilterableCitySelector from '../components/FilterableCitySelector'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import Helmet from '../components/Helmet'
import { useTranslation } from 'react-i18next'
import buildConfig from '../constants/buildConfig'

type PropsType = {
  cities: Array<CityModel>
} & RouteComponentProps<{ languageCode: string }>

const LandingPage = ({ cities, match }: PropsType): ReactElement => {
  const { languageCode } = match.params
  const { t } = useTranslation('landing')

  const pageTitle = t('app:pageTitles.landing')
  const metaDescription = t('app:metaDescription', { appName: buildConfig().appName })

  return (
    <Layout footer={<GeneralFooter language={languageCode} />}>
      <Helmet pageTitle={pageTitle} metaDescription={metaDescription} />
      <FilterableCitySelector cities={cities} language={languageCode} />
    </Layout>
  )
}

export default LandingPage
