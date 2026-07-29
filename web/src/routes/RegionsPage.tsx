import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { createRegionsEndpoint } from 'shared/api'

import BackToRegionButton from '../components/BackToRegionButton'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Helmet from '../components/Helmet'
import Layout from '../components/Layout'
import RegionSelector from '../components/RegionSelector'
import SuggestToRegionFooter from '../components/SuggestToRegionFooter'
import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'

type RegionsPageProps = {
  languageCode: string
}

const RegionsPage = ({ languageCode }: RegionsPageProps): ReactElement => {
  const { data: regions, isPending, error } = useQueryFromEndpoint(createRegionsEndpoint, cmsApiBaseUrl, undefined)
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
      header={<GeneralHeader languageCode={languageCode} />}
      footer={
        <>
          {buildConfig().featureFlags.suggestToRegion && <SuggestToRegionFooter languageCode={languageCode} />}
          <Footer />
        </>
      }>
      <Helmet pageTitle={pageTitle} metaDescription={metaDescription} rootPage />
      <BackToRegionButton />
      <RegionSelector regions={regions ?? []} language={languageCode} loading={isPending} />
    </Layout>
  )
}

export default RegionsPage
