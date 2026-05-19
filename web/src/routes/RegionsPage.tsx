import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { createRegionsEndpoint, useLoadFromEndpoint } from 'shared/api'

import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Helmet from '../components/Helmet'
import Layout from '../components/Layout'
import RegionSelector from '../components/RegionSelector'
import SuggestToRegionFooter from '../components/SuggestToRegionFooter'
import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'

type RegionsPageProps = {
  languageCode: string
}

const RegionsPage = ({ languageCode }: RegionsPageProps): ReactElement => {
  const { data: regions, loading, error } = useLoadFromEndpoint(createRegionsEndpoint, cmsApiBaseUrl, undefined)
  const [stickyTop, setStickyTop] = useState<number>(0)
  const { t } = useTranslation('regions')

  const pageTitle = t('pageTitle')
  const metaDescription = t('metaDescription', { appName: buildConfig().appName })

  if (error) {
    return (
      <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
        <FailureSwitcherWithHelmet error={error} />
      </Layout>
    )
  }

  return (
    <Layout
      header={<GeneralHeader languageCode={languageCode} onStickyTopChanged={setStickyTop} />}
      footer={
        <>
          {buildConfig().featureFlags.suggestToRegion && <SuggestToRegionFooter languageCode={languageCode} />}
          <Footer />
        </>
      }>
      <Helmet pageTitle={pageTitle} metaDescription={metaDescription} rootPage />
      <RegionSelector regions={regions ?? []} language={languageCode} stickyTop={stickyTop} loading={loading} />
    </Layout>
  )
}

export default RegionsPage
