import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { normalizePath, pathnameFromRouteInformation, POIS_ROUTE } from 'shared'
import { useLoadFromEndpoint, createPOIsEndpoint } from 'shared/api'

import { RegionRouteProps } from '../RegionContentNavigator'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import Pois from '../components/Pois'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import { cmsApiBaseUrl } from '../constants/urls'
import useTtsPlayer from '../hooks/useTtsPlayer'
import useUserLocation from '../hooks/useUserLocation'

const PoisPage = ({ regionCode, languageCode, region, pathname }: RegionRouteProps): ReactElement | null => {
  const params = useParams()
  const slug = params.slug ? normalizePath(params.slug) : undefined
  const { t } = useTranslation('pois')
  const { data: userLocation } = useUserLocation()

  const { data, loading, error } = useLoadFromEndpoint(createPOIsEndpoint, cmsApiBaseUrl, {
    region: regionCode,
    language: languageCode,
  })
  const poi = data?.find(it => it.slug === slug)
  useTtsPlayer(poi, languageCode)

  if (!region) {
    return null
  }

  const languageChangePaths = region.languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path =
      poi?.availableLanguages[code] ??
      pathnameFromRouteInformation({
        route: POIS_ROUTE,
        regionCode,
        languageCode: code,
      })
    return {
      path: isCurrentLanguage ? pathname : path,
      name,
      code,
    }
  })

  const locationLayoutParams: Omit<RegionContentLayoutProps, 'isLoading'> = {
    region,
    languageChangePaths,
    languageCode,
    pageTitle: null,
    fitScreen: true,
  }

  if (error) {
    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcherWithHelmet error={error} />
      </RegionContentLayout>
    )
  }

  const pageTitle = `${poi?.title ?? t('pageTitle')} - ${region.name}`

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams} pageTitle={pageTitle}>
      <Helmet
        pageTitle={pageTitle}
        metaDescription={poi?.metaDescription}
        languageChangePaths={languageChangePaths}
        regionModel={region}
      />
      <Pois loading={loading} pois={data ?? []} userLocation={userLocation} region={region} />
    </RegionContentLayout>
  )
}

export default PoisPage
