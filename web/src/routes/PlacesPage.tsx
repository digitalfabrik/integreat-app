import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { normalizePath, pathnameFromRouteInformation, PLACES_ROUTE } from 'shared'
import { createPlacesEndpoint } from 'shared/api'

import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import Places from '../components/Places'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import { cmsApiBaseUrl } from '../constants/urls'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import useTtsPlayer from '../hooks/useTtsPlayer'
import useUserLocation from '../hooks/useUserLocation'
import { RegionRouteProps } from './index'

const PlacesPage = ({ regionCode, languageCode, region, pathname }: RegionRouteProps): ReactElement | null => {
  const params = useParams()
  const slug = params.slug ? normalizePath(params.slug) : undefined
  const { t } = useTranslation('places')
  const { data: userLocation } = useUserLocation()

  const { data, isPending, error } = useQueryFromEndpoint(createPlacesEndpoint, cmsApiBaseUrl, {
    region: regionCode,
    language: languageCode,
  })
  const place = data?.find(it => it.slug === slug)
  useTtsPlayer(place, languageCode)

  if (!region) {
    return null
  }

  const languageChangePaths = region.languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path =
      place?.availableLanguages[code] ??
      pathnameFromRouteInformation({
        route: PLACES_ROUTE,
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
    slug: null,
    fitScreen: true,
  }

  if (error) {
    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcherWithHelmet error={error} />
      </RegionContentLayout>
    )
  }

  const pageTitle = `${place?.title ?? t('pageTitle')} - ${region.name}`

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams} pageTitle={pageTitle}>
      <Helmet
        pageTitle={pageTitle}
        metaDescription={place?.metaDescription}
        languageChangePaths={languageChangePaths}
        regionModel={region}
      />
      <Places loading={isPending} places={data ?? []} userLocation={userLocation} region={region} />
    </RegionContentLayout>
  )
}

export default PlacesPage
