import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CityModel, LANDING_ROUTE } from 'api-client'

import CityNotCooperatingFooter from '../components/CityNotCooperatingFooter'
import FilterableCitySelector from '../components/FilterableCitySelector'
import GeneralFooter from '../components/GeneralFooter'
import Helmet from '../components/Helmet'
import Layout from '../components/Layout'
import buildConfig from '../constants/buildConfig'
import ScrollToTopOnMount from '../utils/scrollToTop'
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
    <Layout
      footer={
        <>
          <CityNotCooperatingFooter languageCode={languageCode} />
          <GeneralFooter language={languageCode} />
        </>
      }>
      <ScrollToTopOnMount />
      <Helmet pageTitle={pageTitle} metaDescription={metaDescription} />
      <FilterableCitySelector cities={cities} language={languageCode} />
    </Layout>
  )
}

export default LandingPage
