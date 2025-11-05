import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { normalizePath, pathnameFromRouteInformation, POIS_ROUTE } from 'shared'
import { useLoadFromEndpoint, createPOIsEndpoint } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import Pois from '../components/Pois'
import SkeletonHeader from '../components/SkeletonHeader'
import SkeletonList from '../components/SkeletonList'
import { cmsApiBaseUrl } from '../constants/urls'
import useTtsPlayer from '../hooks/useTtsPlayer'
import useUserLocation from '../hooks/useUserLocation'

const RootGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column-reverse',
  },
}))

const SkeletonListContainer = styled(Grid)(({ theme }) => ({
  width: '20%',
  minWidth: 360,

  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '50%',
  },
}))

const MapSkeleton = styled(Grid)(({ theme }) => ({
  flexGrow: 1,
  width: 'auto',
  height: '100%',
  [theme.breakpoints.down('md')]: {
    height: '50%',
    width: '100%',
  },
}))

const PoisPage = ({ cityCode, languageCode, city, pathname }: CityRouteProps): ReactElement | null => {
  const params = useParams()
  const slug = params.slug ? normalizePath(params.slug) : undefined
  const { t } = useTranslation('pois')
  const { data: userLocation } = useUserLocation()

  const { data, loading, error } = useLoadFromEndpoint(createPOIsEndpoint, cmsApiBaseUrl, {
    city: cityCode,
    language: languageCode,
  })
  const poi = data?.find(it => it.slug === slug)
  useTtsPlayer(poi, languageCode)

  if (!city) {
    return null
  }

  const languageChangePaths = city.languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path =
      poi?.availableLanguages[code] ??
      pathnameFromRouteInformation({
        route: POIS_ROUTE,
        cityCode,
        languageCode: code,
      })
    return {
      path: isCurrentLanguage ? pathname : path,
      name,
      code,
    }
  })

  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    languageCode,
    pageTitle: null,
    fitScreen: true,
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <RootGrid container>
          <SkeletonListContainer container paddingX={2}>
            <Stack width='100%'>
              <SkeletonHeader width='90%' />
              <SkeletonList />
            </Stack>
          </SkeletonListContainer>
          <MapSkeleton container>
            <Skeleton variant='rectangular' width='100%' height='100%' />
          </MapSkeleton>
        </RootGrid>
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

  const pageTitle = `${poi?.title ?? t('pageTitle')} - ${city.name}`

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams} pageTitle={pageTitle}>
      <Helmet
        pageTitle={pageTitle}
        metaDescription={poi?.metaDescription}
        languageChangePaths={languageChangePaths}
        cityModel={city}
      />
      {data && <Pois pois={data} userLocation={userLocation} city={city} />}
    </CityContentLayout>
  )
}

export default PoisPage
