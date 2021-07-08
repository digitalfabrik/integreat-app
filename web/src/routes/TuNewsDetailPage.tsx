import React, { ReactElement, useCallback, useContext } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import {
  CityModel,
  createTunewsElementEndpoint,
  LanguageModel,
  normalizePath,
  NotFoundError,
  TU_NEWS_TYPE,
  useLoadFromEndpoint,
  parseHTML
} from 'api-client'
import LocationLayout from '../components/LocationLayout'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { TU_NEWS_DETAIL_ROUTE } from './index'
import { tunewsApiBaseUrl } from '../constants/urls'
import LoadingSpinner from '../components/LoadingSpinner'
import FailureSwitcher from '../components/FailureSwitcher'
import Page from '../components/Page'
import styled from 'styled-components'
import TunewsIcon from '../assets/TunewsActiveLogo.png'
import Helmet from '../components/Helmet'

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
  background-color: ${({ theme }) => theme.colors.tunewsThemeColorLight};
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
  background-color: ${({ theme }) => theme.colors.tunewsThemeColor};
  color: ${({ theme }) => theme.colors.backgroundColor};
  font-size: 20px;
  font-weight: 700;
`

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string; newsId: string }>

const TuNewsDetailPage = ({ match, cityModel, languages, location }: PropsType): ReactElement => {
  const { cityCode, languageCode, newsId } = match.params
  const pathname = normalizePath(location.pathname)
  const history = useHistory()
  const formatter = useContext(DateFormatterContext)
  const viewportSmall = false

  const requestTuNews = useCallback(async () => {
    return createTunewsElementEndpoint(tunewsApiBaseUrl).request({ id: parseInt(newsId) })
  }, [newsId])
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
    pathname
  }

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (!newsModel) {
    const error =
      newsError ||
      new NotFoundError({
        type: TU_NEWS_TYPE,
        id: pathname,
        city: cityCode,
        language: languageCode
      })

    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  const decodedNewsModelTitle = parseHTML(newsModel.title)
  const pageTitle = `${newsModel.title} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <StyledContainer>
        <StyledWrapper>
          <StyledBanner>
            <StyledTitle>
              <StyledBannerImage src={TunewsIcon} alt='' />
            </StyledTitle>
          </StyledBanner>
          <Page
            title={decodedNewsModelTitle}
            content={newsModel.content}
            formatter={formatter}
            lastUpdateFormat='LLL'
            lastUpdate={newsModel.date}
            showLastUpdateText={false}
            onInternalLinkClick={history.push}
          />
        </StyledWrapper>
      </StyledContainer>
    </LocationLayout>
  )
}

export default TuNewsDetailPage
