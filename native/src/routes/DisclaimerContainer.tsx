import React, { ReactElement, useCallback } from 'react'
import { RefreshControl } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from 'styled-components'

import {
  createDisclaimerEndpoint,
  DISCLAIMER_ROUTE,
  DisclaimerRouteType,
  fromError,
  PageModel,
  useLoadFromEndpoint
} from 'api-client'

import Failure from '../components/Failure'
import LayoutedScrollView from '../components/LayoutedScrollView'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import useReportError from '../hooks/useReportError'
import useSetShareUrl from '../hooks/useSetShareUrl'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import { StateType } from '../redux/StateType'
import { determineApiUrl } from '../utils/helpers'
import Disclaimer from './Disclaimer'

type PropsType = {
  route: RoutePropType<DisclaimerRouteType>
  navigation: NavigationPropType<DisclaimerRouteType>
}

const DisclaimerContainer = ({ navigation, route }: PropsType): ReactElement => {
  const { cityCode, languageCode } = route.params
  const resourceCacheUrl = useSelector<StateType, string | null>(state => state.resourceCacheUrl)
  const theme = useTheme()

  const routeInformation = { route: DISCLAIMER_ROUTE, languageCode, cityCode }
  useSetShareUrl({ navigation, routeInformation, route })

  const request = useCallback(async () => {
    const apiUrl = await determineApiUrl()
    return createDisclaimerEndpoint(apiUrl).request({
      city: cityCode,
      language: languageCode
    })
  }, [cityCode, languageCode])
  const { data: disclaimer, error, loading, refresh } = useLoadFromEndpoint<PageModel>(request)
  useReportError(error)

  const navigateToFeedback = (isPositiveFeedback: boolean) => {
    createNavigateToFeedbackModal(navigation)({
      routeType: DISCLAIMER_ROUTE,
      cityCode,
      language: languageCode,
      isPositiveFeedback,
      path: disclaimer?.path
    })
  }

  if (error) {
    return (
      <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={loading} />}>
        <Failure code={fromError(error)} tryAgain={refresh} />
      </LayoutedScrollView>
    )
  }

  return (
    <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={loading} />}>
      {disclaimer && resourceCacheUrl && (
        <Disclaimer resourceCacheUrl={resourceCacheUrl} disclaimer={disclaimer} theme={theme} language={languageCode} />
      )}
      <SiteHelpfulBox navigateToFeedback={navigateToFeedback} />
    </LayoutedScrollView>
  )
}

export default DisclaimerContainer
