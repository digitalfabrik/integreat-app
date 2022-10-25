import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CityModel } from 'api-client'

import CityNotCooperatingFooter from '../components/CityNotCooperatingFooter'
import CitySelector from '../components/CitySelector'
import GeneralFooter from '../components/GeneralFooter'
import Helmet from '../components/Helmet'
import Layout from '../components/Layout'
import buildConfig from '../constants/buildConfig'

type LandingPageProps = {
  cities: Array<CityModel>
  languageCode: string
}

const LandingPage = ({ cities, languageCode }: LandingPageProps): ReactElement => {
  const { t } = useTranslation('landing')

  const pageTitle = t('pageTitle')
  const metaDescription = t('metaDescription', { appName: buildConfig().appName })

  return (
    <Layout
      footer={
        <>
          {buildConfig().featureFlags.cityNotCooperating && <CityNotCooperatingFooter languageCode={languageCode} />}
          <GeneralFooter language={languageCode} />
        </>
      }>
      <Helmet pageTitle={pageTitle} metaDescription={metaDescription} />
      <CitySelector cities={cities} language={languageCode} />
    </Layout>
  )
}

export default LandingPage
