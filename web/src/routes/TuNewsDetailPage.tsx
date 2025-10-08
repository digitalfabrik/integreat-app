import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { TU_NEWS_TYPE } from 'shared'
import { createTunewsElementEndpoint, NotFoundError, useLoadFromEndpoint } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import { TuNewsActiveIcon } from '../assets'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import Page from '../components/Page'
import Icon from '../components/base/Icon'
import { tunewsApiBaseUrl } from '../constants/urls'
import useTtsPlayer from '../hooks/useTtsPlayer'

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledBanner = styled('div')`
  position: relative;
  display: flex;
  height: 60px;
  overflow: hidden;
  align-items: center;
  margin: 25px 0;
  background-color: ${props => props.theme.legacy.colors.tunewsThemeColorLight};
  border-radius: 11px;
`

const StyledIcon = styled(Icon)`
  width: 100%;
  height: 100%;
`

const StyledTitle = styled('div')`
  display: flex;
  width: 185px;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.legacy.colors.tunewsThemeColor};
  color: ${props => props.theme.legacy.colors.backgroundColor};
  font-size: 20px;
  font-weight: 700;
`

const TuNewsDetailPage = ({ city, pathname, cityCode, languageCode }: CityRouteProps): ReactElement | null => {
  // This component is only opened when there is a news ID in the route
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const newsId = useParams().newsId!
  const { t } = useTranslation('news')

  const {
    data: newsModel,
    loading,
    error: newsError,
  } = useLoadFromEndpoint(createTunewsElementEndpoint, tunewsApiBaseUrl, { id: parseInt(newsId, 10) })

  useTtsPlayer(newsModel, languageCode)

  if (!city) {
    return null
  }

  const pageTitle = `${newsModel?.title ?? t('pageTitle')} - ${city.name}`

  // Language change is not possible between tuNews detail views because we don't know the id of other languages
  const languageChangePaths = city.languages.map(({ code, name }) => ({ path: null, name, code }))
  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    languageCode,
    Toolbar: <CityContentToolbar />,
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (!newsModel) {
    const error =
      !newsError || newsError instanceof NotFoundError
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
      <StyledContainer>
        <>
          <StyledBanner>
            <StyledTitle>
              <StyledIcon src={TuNewsActiveIcon} />
            </StyledTitle>
          </StyledBanner>
          <Page
            title={newsModel.title}
            content={newsModel.content}
            lastUpdate={newsModel.date}
            showLastUpdateText={false}
          />
        </>
      </StyledContainer>
    </CityContentLayout>
  )
}

export default TuNewsDetailPage
