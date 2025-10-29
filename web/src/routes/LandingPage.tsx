import Box from '@mui/material/Box'
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
import ListSkeleton from '../components/ListSkeleton'
import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'

type LandingPageProps = {
  languageCode: string
}

const LandingPage = ({ languageCode }: LandingPageProps): ReactElement => {
  const { data: cities, loading, error } = useLoadFromEndpoint(createCitiesEndpoint, cmsApiBaseUrl, undefined)
  const [stickyTop, setStickyTop] = useState<number>(0)
  const { t } = useTranslation('landing')

  const pageTitle = t('pageTitle')
  const metaDescription = t('metaDescription', { appName: buildConfig().appName })

  if (loading) {
    return (
      <Layout header={<GeneralHeader languageCode={languageCode} onStickyTopChanged={setStickyTop} />}>
        <Box maxWidth={640}>
          <ListSkeleton
            showBreadcrumbSkeleton={false}
            showItemIcon={false}
            showSkeletonAdditionalText
            showSkeletonSearch
          />
        </Box>
      </Layout>
    )
  }

  if (error || !cities) {
    return (
      <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
        <FailureSwitcher error={error ?? new Error('Uknown error')} />
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
      <CitySelector cities={cities} language={languageCode} stickyTop={stickyTop} />
    </Layout>
  )
}

export default LandingPage
