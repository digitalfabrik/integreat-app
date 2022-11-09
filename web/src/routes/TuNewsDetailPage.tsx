import React, { ReactElement, useCallback, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { createTunewsElementEndpoint, NotFoundError, TU_NEWS_TYPE, useLoadFromEndpoint } from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import TunewsIcon from '../assets/TunewsActiveLogo.png'
import CityContentLayout from '../components/CityContentLayout'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import Page from '../components/Page'
import { tunewsApiBaseUrl } from '../constants/urls'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { TU_NEWS_DETAIL_ROUTE } from './index'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const StyledWrapper = styled.div`
  padding-bottom: 50px;
`
const StyledBanner = styled.div`
  position: relative;
  display: flex;
  height: 60px;
  overflow: hidden;
  align-items: center;
  margin: 25px 0;
  background-color: ${props => props.theme.colors.tunewsThemeColorLight};
  border-radius: 11px;
`
const StyledBannerImage = styled.img`
  max-height: 100%;
`
const StyledTitle = styled.div`
  display: flex;
  width: 205px;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.tunewsThemeColor};
  color: ${props => props.theme.colors.backgroundColor};
  font-size: 20px;
  font-weight: 700;
`

const TuNewsDetailPage = ({ cityModel, languages, pathname, cityCode, languageCode }: CityRouteProps): ReactElement => {
  const newsId = useParams().newsId!
  const formatter = useContext(DateFormatterContext)
  const navigate = useNavigate()
  const viewportSmall = false

  const requestTuNews = useCallback(
    async () => createTunewsElementEndpoint(tunewsApiBaseUrl).request({ id: parseInt(newsId, 10) }),
    [newsId]
  )
  const { data: newsModel, loading, error: newsError } = useLoadFromEndpoint(requestTuNews)

  // Language change is not possible between tuNews detail views because we don't know the id of other languages
  const languageChangePaths = languages.map(({ code, name }) => ({ path: null, name, code }))

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths,
    route: TU_NEWS_DETAIL_ROUTE,
    languageCode,
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
      newsError ||
      new NotFoundError({
        type: TU_NEWS_TYPE,
        id: pathname,
        city: cityCode,
        language: languageCode,
      })

    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  const pageTitle = `${newsModel.title} - ${cityModel.name}`

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <StyledContainer>
        <StyledWrapper>
          <StyledBanner>
            <StyledTitle>
              <StyledBannerImage src={TunewsIcon} alt='' />
            </StyledTitle>
          </StyledBanner>
          <Page
            title={newsModel.title}
            content={newsModel.content}
            formatter={formatter}
            lastUpdateFormat='LLL'
            lastUpdate={newsModel.date}
            showLastUpdateText={false}
            onInternalLinkClick={navigate}
          />
        </StyledWrapper>
      </StyledContainer>
    </CityContentLayout>
  )
}

export default TuNewsDetailPage
