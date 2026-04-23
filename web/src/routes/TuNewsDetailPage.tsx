import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useParams } from 'react-router'

import { TU_NEWS_TYPE, tunewsLabel } from 'shared'
import { createTunewsElementEndpoint, NotFoundError, useLoadFromEndpoint } from 'shared/api'

import { RegionRouteProps } from '../RegionContentNavigator'
import { TuNewsActiveIcon } from '../assets'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import Page from '../components/Page'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import SkeletonPage from '../components/SkeletonPage'
import Svg from '../components/base/Svg'
import { tunewsApiBaseUrl } from '../constants/urls'
import useTtsPlayer from '../hooks/useTtsPlayer'

const TuNewsBanner = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  marginBlock: 24,
  backgroundColor: theme.palette.tunews.light,
  borderRadius: 12,
  height: 60,
  alignItems: 'start',
}))

const IconContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.tunews.main,
  shapeRendering: 'crispEdges',
}))

const TuNewsDetailPage = ({ region, pathname, regionCode, languageCode }: RegionRouteProps): ReactElement | null => {
  // This component is only opened when there is a news ID in the route
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const newsId = useParams().newsId!

  const { data: newsModel, error: newsError } = useLoadFromEndpoint(createTunewsElementEndpoint, tunewsApiBaseUrl, {
    id: parseInt(newsId, 10),
  })

  useTtsPlayer(newsModel, languageCode)

  if (!region) {
    return null
  }

  const pageTitle = `${newsModel?.title ?? tunewsLabel} - ${region.name}`

  // Language change is not possible between tuNews detail views because we don't know the id of other languages
  const languageChangePaths = region.languages.map(({ code, name }) => ({
    path: code === languageCode ? pathname : null,
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

  if (newsError) {
    const error =
      newsError instanceof NotFoundError
        ? new NotFoundError({
            type: TU_NEWS_TYPE,
            id: pathname,
            region: regionCode,
            language: languageCode,
          })
        : newsError

    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcherWithHelmet error={error} />
      </RegionContentLayout>
    )
  }

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
      <TuNewsBanner>
        <IconContainer width={180} height='100%'>
          <Svg src={TuNewsActiveIcon} width='100%' height='100%' />
        </IconContainer>
      </TuNewsBanner>
      {!newsModel ? (
        <SkeletonPage />
      ) : (
        <Page
          title={newsModel.title}
          content={newsModel.content}
          lastUpdate={newsModel.lastUpdate}
          showLastUpdateText={false}
        />
      )}
    </RegionContentLayout>
  )
}

export default TuNewsDetailPage
