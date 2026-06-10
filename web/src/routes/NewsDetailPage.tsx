import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { NEWS_ROUTE, pathnameFromRouteInformation } from 'shared'
import { createNewsElementEndpoint, TU_NEWS_SOURCE } from 'shared/api'

import { TuNewsActiveIcon } from '../assets'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import Page from '../components/Page'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import SkeletonPage from '../components/SkeletonPage'
import Svg from '../components/base/Svg'
import { cmsApiBaseUrl } from '../constants/urls'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import useTtsPlayer from '../hooks/useTtsPlayer'
import { RegionRouteProps } from './index'

const TuNewsBanner = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  marginBlock: 24,
  backgroundColor: theme.palette.tuNews.light,
  borderRadius: 12,
  height: 60,
  alignItems: 'start',
}))

const IconContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.tuNews.main,
  shapeRendering: 'crispEdges',
}))

const NewsDetailPage = ({ region, pathname, regionCode, languageCode }: RegionRouteProps): ReactElement | null => {
  const { data: news, error } = useQueryFromEndpoint(createNewsElementEndpoint, cmsApiBaseUrl, {
    region: regionCode,
    language: languageCode,
    // This component is only opened when there is a news ID in the route
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    id: useParams().id!,
  })
  const { t } = useTranslation('news')

  useTtsPlayer(news, languageCode)

  if (!region) {
    return null
  }

  const pageTitle = `${news?.title ?? t('news')} - ${region.name}`

  const languageChangePaths = region.languages.map(({ code, name }) => ({
    path:
      code === languageCode
        ? pathname
        : pathnameFromRouteInformation({
            route: NEWS_ROUTE,
            regionCode,
            languageCode: code,
            id: news?.availableLanguages?.[code],
          }),
    name,
    code,
  }))

  const locationLayoutParams: Omit<RegionContentLayoutProps, 'isLoading'> = {
    region,
    languageChangePaths,
    languageCode,
    pageTitle,
    Toolbar: <RegionContentToolbar />,
  }

  if (error) {
    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcherWithHelmet error={error} />
      </RegionContentLayout>
    )
  }

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
      {!news ? (
        <SkeletonPage />
      ) : (
        <>
          {news.source === TU_NEWS_SOURCE && (
            <TuNewsBanner>
              <IconContainer width={180} height='100%'>
                <Svg src={TuNewsActiveIcon} width='100%' height='100%' />
              </IconContainer>
            </TuNewsBanner>
          )}
          <Page title={news.title} content={news.content} lastUpdate={news.lastUpdate} showLastUpdateText={false} />
        </>
      )}
    </RegionContentLayout>
  )
}

export default NewsDetailPage
