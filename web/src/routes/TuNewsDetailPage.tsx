import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useParams } from 'react-router'

import { TU_NEWS_TYPE, tunewsLabel } from 'shared'
import { createTunewsElementEndpoint, NotFoundError, useLoadFromEndpoint } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import { TuNewsActiveIcon } from '../assets'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import Page from '../components/Page'
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

const TuNewsDetailPage = ({ city, pathname, cityCode, languageCode }: CityRouteProps): ReactElement | null => {
  // This component is only opened when there is a news ID in the route
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const newsId = useParams().newsId!

  const {
    data: newsModel,
    loading,
    error: newsError,
  } = useLoadFromEndpoint(createTunewsElementEndpoint, tunewsApiBaseUrl, { id: parseInt(newsId, 10) })

  useTtsPlayer(newsModel, languageCode)

  if (!city) {
    return null
  }

  const pageTitle = `${newsModel?.title ?? tunewsLabel} - ${city.name}`

  // Language change is not possible between tuNews detail views because we don't know the id of other languages
  const languageChangePaths = city.languages.map(({ code, name }) => ({
    path: code === languageCode ? pathname : null,
    name,
    code,
  }))

  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    languageCode,
    pageTitle,
    Toolbar: <CityContentToolbar />,
  }

  if (newsError) {
    const error =
      newsError instanceof NotFoundError
        ? new NotFoundError({
            type: TU_NEWS_TYPE,
            id: pathname,
            city: cityCode,
            language: languageCode,
          })
        : newsError

    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <TuNewsBanner>
        <IconContainer width={180} height='100%'>
          <Svg src={TuNewsActiveIcon} width='100%' height='100%' />
        </IconContainer>
      </TuNewsBanner>
      {loading ? (
        <SkeletonPage />
      ) : (
        newsModel && (
          <Page
            title={newsModel.title}
            content={newsModel.content}
            lastUpdate={newsModel.date}
            showLastUpdateText={false}
          />
        )
      )}
    </CityContentLayout>
  )
}

export default TuNewsDetailPage
