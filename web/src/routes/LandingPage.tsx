import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { createCitiesEndpoint, useLoadFromEndpoint } from 'api-client'

import CityNotCooperatingFooter from '../components/CityNotCooperatingFooter'
import CitySelector from '../components/CitySelector'
import FailureSwitcher from '../components/FailureSwitcher'
import GeneralFooter from '../components/GeneralFooter'
import GeneralHeader from '../components/GeneralHeader'
import Helmet from '../components/Helmet'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'

type LandingPageProps = {
  languageCode: string
}

const LandingPage = ({ languageCode }: LandingPageProps): ReactElement => {
  const { data: cities, loading, error } = useLoadFromEndpoint(createCitiesEndpoint, cmsApiBaseUrl, undefined)
  const { t } = useTranslation('landing')

  const pageTitle = t('pageTitle')
  const metaDescription = t('metaDescription', { appName: buildConfig().appName })

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    )
  }

  if (error || !cities) {
    return (
      <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<GeneralFooter language={languageCode} />}>
        <FailureSwitcher error={error ?? new Error('Uknown error')} />
      </Layout>
    )
  }

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
