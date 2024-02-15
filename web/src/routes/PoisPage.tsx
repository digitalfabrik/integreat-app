import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { normalizePath, pathnameFromRouteInformation, POIS_ROUTE } from 'shared'
import { useLoadFromEndpoint, createPOIsEndpoint, useLoadAsync } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import Pois from '../components/Pois'
import { cmsApiBaseUrl } from '../constants/urls'
import getUserLocation from '../utils/getUserLocation'

const PoisPage = ({ cityCode, languageCode, city, pathname }: CityRouteProps): ReactElement | null => {
  const params = useParams()
  const slug = params.slug ? normalizePath(params.slug) : undefined
  const { t } = useTranslation('pois')

  const { data, loading, error } = useLoadFromEndpoint(createPOIsEndpoint, cmsApiBaseUrl, {
    city: cityCode,
    language: languageCode,
  })
  const poi = data?.find(it => it.slug === slug)

  const { data: userLocation } = useLoadAsync(
    useCallback(async () => {
      const userLocation = await getUserLocation()
      return userLocation.status === 'ready' ? userLocation.coordinates : null
    }, []),
  )

  if (!city) {
    return null
  }

  const languageChangePaths = city.languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path = poi
      ? poi.availableLanguages.get(code) || null
      : pathnameFromRouteInformation({ route: POIS_ROUTE, cityCode, languageCode: code })
    return {
      path: isCurrentLanguage ? pathname : path,
      name,
      code,
    }
  })

  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    route: POIS_ROUTE,
    languageCode,
    disableScrollingSafari: true,
    showFooter: false,
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (error) {
    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  const pageTitle = `${t('pageTitle')} - ${city.name}`

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams} fullWidth>
      <Helmet
        pageTitle={pageTitle}
        metaDescription={poi?.metaDescription}
        languageChangePaths={languageChangePaths}
        cityModel={city}
      />
      {data && (
        <Pois pois={data} userLocation={userLocation} city={city} languageCode={languageCode} pageTitle={pageTitle} />
      )}
    </CityContentLayout>
  )
}

export default PoisPage
