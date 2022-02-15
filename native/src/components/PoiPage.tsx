import React, { ReactElement, useCallback } from 'react'
import { TFunction } from 'react-i18next'
import { Button } from 'react-native'
import styled from 'styled-components/native'

import { CityModel, PoiModel, POIS_ROUTE, RouteInformationType } from 'api-client/src'
import { ThemeType } from 'build-configs/ThemeType'

import useSnackbar from '../hooks/useSnackbar'
import { LanguageResourceCacheStateType } from '../redux/StateType'
import { getNavigationDeepLinks } from '../utils/getNavigationDeepLinks'
import openExternalUrl from '../utils/openExternalUrl'
import { FeedbackInformationType } from './FeedbackContainer'
import Page from './Page'
import PageDetail from './PageDetail'

const Spacer = styled.View`
  width: 20px;
  height: 20px;
`

type PropsType = {
  poi: PoiModel
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  language: string
  cityModel: CityModel
  navigateTo: (arg0: RouteInformationType) => void
  navigateToFeedback: (arg0: FeedbackInformationType) => void
  theme: ThemeType
  t: TFunction<'pois'>
}
const PoiPage = ({
  poi,
  resourceCache,
  resourceCacheUrl,
  language,
  cityModel,
  navigateTo,
  navigateToFeedback,
  theme,
  t
}: PropsType): ReactElement => {
  const createNavigateToFeedbackForPoi =
    (poi: PoiModel) =>
    (isPositiveFeedback: boolean): void => {
      navigateToFeedback({
        routeType: POIS_ROUTE,
        language,
        path: poi.path,
        cityCode: cityModel.code,
        isPositiveFeedback
      })
    }

  const navigateToPois = (cityCode: string, language: string, urlSlug: string) => (): void => {
    navigateTo({
      route: POIS_ROUTE,
      cityCode,
      languageCode: language,
      urlSlug
    })
  }
  const showSnackbar = useSnackbar()
  const openNavigationUrl = useCallback(
    (url: string) => {
      openExternalUrl(url).catch((error: Error) => showSnackbar(error.message))
    },
    [showSnackbar]
  )

  const { location } = poi.location
  const files = resourceCache[poi.path] || {}

  const navigationUrl = getNavigationDeepLinks(poi.location)

  return (
    <Page
      content={poi.content}
      title={poi.title}
      lastUpdate={poi.lastUpdate}
      language={language}
      files={files}
      resourceCacheUrl={resourceCacheUrl}
      navigateToFeedback={createNavigateToFeedbackForPoi(poi)}>
      <>
        {location && <PageDetail identifier={t('location')} information={location} theme={theme} language={language} />}
        {navigationUrl && (
          <>
            <Button title={t('map')} onPress={navigateToPois(cityModel.code, language, poi.urlSlug)} />
            <Spacer />
            <Button title={t('navigation')} onPress={() => navigationUrl && openNavigationUrl(navigationUrl)} />
          </>
        )}
      </>
    </Page>
  )
}

export default PoiPage
