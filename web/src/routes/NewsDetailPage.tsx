import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { NEWS_ROUTE, pathnameFromRouteInformation } from 'shared'
import { AMAL_NEWS_SOURCE, createNewsElementEndpoint, getNewsSourceLabel, LOCAL_NEWS_SOURCE } from 'shared/api'

import { AmalNewsLogo, TuNewsLogo } from '../assets'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import Page from '../components/Page'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import SkeletonPage from '../components/SkeletonPage'
import Link from '../components/base/Link'
import Svg from '../components/base/Svg'
import { cmsApiBaseUrl } from '../constants/urls'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import useTtsPlayer from '../hooks/useTtsPlayer'
import { RegionRouteProps } from './index'

const CenteredLink = styled(Link)({
  display: 'flex',
  justifyContent: 'center',
})

const TuNewsImage = styled('img')({
  width: 200,
  height: 64,
  borderRadius: 8,
})

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

  const languageChangePaths = region.languages.map(({ code, name }) => {
    const id = news?.availableLanguages?.[code]
    const path = id ? pathnameFromRouteInformation({ route: NEWS_ROUTE, regionCode, languageCode: code, id }) : null
    return {
      path: code === languageCode ? pathname : path,
      name,
      code,
    }
  })

  const locationLayoutParams: Omit<RegionContentLayoutProps, 'isLoading'> = {
    region,
    languageChangePaths,
    languageCode,
    pageTitle,
    slug: null,
    toolbar: <RegionContentToolbar />,
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
      {news ? (
        <Page
          title={news.title}
          content={news.content}
          lastUpdate={news.lastUpdate}
          showLastUpdateText={false}
          footer={
            news.source !== LOCAL_NEWS_SOURCE && (
              <CenteredLink to={news.externalUrl} aria-label={getNewsSourceLabel({ source: news.source, t })}>
                {news.source === AMAL_NEWS_SOURCE ? (
                  <Svg src={AmalNewsLogo} height={64} width='100%' />
                ) : (
                  <TuNewsImage src={TuNewsLogo} alt='' />
                )}
              </CenteredLink>
            )
          }
        />
      ) : (
        <SkeletonPage />
      )}
    </RegionContentLayout>
  )
}

export default NewsDetailPage
