import React, { ReactElement } from 'react'
import { CityModel, LANDING_ROUTE } from 'api-client'
import FilterableCitySelector from '../components/FilterableCitySelector'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import Helmet from '../components/Helmet'
import { useTranslation } from 'react-i18next'
import buildConfig from '../constants/buildConfig'
import { RouteProps } from './index'

type PropsType = {
  cities: Array<CityModel>
} & RouteProps<typeof LANDING_ROUTE>

const LandingPage = ({ cities, match }: PropsType): ReactElement => {
  const { languageCode } = match.params
  const { t } = useTranslation('landing')

  const pageTitle = t('pageTitle')
  const metaDescription = t('metaDescription', { appName: buildConfig().appName })

  return (
    <Layout footer={<GeneralFooter language={languageCode} />}>
      <Helmet pageTitle={pageTitle} metaDescription={metaDescription} />
      <FilterableCitySelector cities={cities} language={languageCode} />
    </Layout>
  )
}

export default LandingPage
