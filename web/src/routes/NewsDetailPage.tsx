import { styled } from '@mui/material/styles'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { NEWS_ROUTE, pathnameFromRouteInformation, replaceLinks } from 'shared'
import { AMAL_NEWS_SOURCE, createNewsElementEndpoint, getNewsSourceLabel, LOCAL_NEWS_SOURCE } from 'shared/api'

import { AmalNewsLogo, TuNewsLogo } from '../assets'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import NewChip from '../components/NewChip'
import Page from '../components/Page'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import SkeletonPage from '../components/SkeletonPage'
import Link from '../components/base/Link'
import Svg from '../components/base/Svg'
import { cmsApiBaseUrl } from '../constants/urls'
import { NEWS_VISITED_IDS_STORAGE_KEY } from '../hooks/useLocalStorage'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import useTtsPlayer from '../hooks/useTtsPlayer'
import useVisitedIds from '../hooks/useVisitedIds'
import { RegionRouteProps } from './index'

const CenteredLink = styled(Link)({
  display: 'flex',
  justifyContent: 'center',
  paddingBlock: 32,
})

const StyledNewChip = styled(NewChip)(({ theme }) => ({
  alignSelf: 'flex-end',
  marginTop: 12,

  [theme.breakpoints.up('md')]: {
    alignSelf: 'flex-start',
    marginTop: 16,
  },
}))

const NewsDetailPage = ({ region, pathname, regionCode, languageCode }: RegionRouteProps): ReactElement | null => {
  // This component is only opened when there is a news ID in the route
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const id = useParams().id!
  const { data: news, error } = useQueryFromEndpoint(createNewsElementEndpoint, cmsApiBaseUrl, {
    region: regionCode,
    language: languageCode,
    id,
  })
  const { t } = useTranslation()
  const [visitedNewsIds, addVisitedNewsId] = useVisitedIds({ key: NEWS_VISITED_IDS_STORAGE_KEY, regionCode })
  const [visited] = useState(visitedNewsIds.includes(id))

  useTtsPlayer(news, languageCode)

  useEffect(() => {
    addVisitedNewsId(id)
  }, [id, addVisitedNewsId])

  if (!region) {
    return null
  }

  const pageTitle = `${news?.title ?? t($ => $.news.title)} - ${region.name}`

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
          titleAdornment={news.isNew && !visited ? <StyledNewChip /> : undefined}
          content={news.source === LOCAL_NEWS_SOURCE ? replaceLinks(news.content) : news.content}
          lastUpdate={news.lastUpdate}
          showLastUpdateText={false}
          footer={
            news.source !== LOCAL_NEWS_SOURCE && (
              <CenteredLink to={news.externalUrl} aria-label={getNewsSourceLabel({ source: news.source, t })}>
                <Svg src={news.source === AMAL_NEWS_SOURCE ? AmalNewsLogo : TuNewsLogo} height={64} width='100%' />
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
