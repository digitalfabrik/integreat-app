import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { createCitiesEndpoint, useLoadFromEndpoint } from 'shared/api'

import CityNotCooperatingFooter from '../components/CityNotCooperatingFooter'
import CitySelector from '../components/CitySelector'
import FailureSwitcher from '../components/FailureSwitcher'
import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Helmet from '../components/Helmet'
import Layout from '../components/Layout'
import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'

type LandingPageProps = {
  languageCode: string
}

const LandingPage = ({ languageCode }: LandingPageProps): ReactElement => {
  const { data: cities, error } = useLoadFromEndpoint(createCitiesEndpoint, cmsApiBaseUrl, undefined)
  const [stickyTop, setStickyTop] = useState<number>(0)
  const { t } = useTranslation('landing')

  const pageTitle = t('pageTitle')
  const metaDescription = t('metaDescription', { appName: buildConfig().appName })

  if (error) {
    return (
      <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
        <FailureSwitcher error={error} />
      </Layout>
    )
  }

  return (
    <Layout
      header={<GeneralHeader languageCode={languageCode} onStickyTopChanged={setStickyTop} />}
      footer={
        <>
          {buildConfig().featureFlags.cityNotCooperating && <CityNotCooperatingFooter languageCode={languageCode} />}
          <Footer />
        </>
      }>
      <Helmet pageTitle={pageTitle} metaDescription={metaDescription} rootPage />
      <CitySelector cities={cities ?? []} language={languageCode} stickyTop={stickyTop} loading={loading} />
    </Layout>
  )
}

export default LandingPage
