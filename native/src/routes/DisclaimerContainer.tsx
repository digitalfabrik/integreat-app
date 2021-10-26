import React, { useCallback } from 'react'
import { RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import {
  createDisclaimerEndpoint,
  DISCLAIMER_ROUTE,
  DisclaimerRouteType,
  fromError,
  PageModel,
  useLoadFromEndpoint
} from 'api-client'
import { ThemeType } from 'build-configs'

import Failure from '../components/Failure'
import LayoutedScrollView from '../components/LayoutedScrollView'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withTheme from '../hocs/withTheme'
import useLogError from '../hooks/useLogError'
import createNavigate from '../navigation/createNavigate'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import navigateToLink from '../navigation/navigateToLink'
import { StateType } from '../redux/StateType'
import { StoreActionType } from '../redux/StoreActionType'
import { determineApiUrl } from '../utils/helpers'
import Disclaimer from './Disclaimer'

type OwnPropsType = {
  route: RoutePropType<DisclaimerRouteType>
  navigation: NavigationPropType<DisclaimerRouteType>
}
type StatePropsType = {
  resourceCacheUrl: string | null | undefined
}

const mapStateToProps = (state: StateType): StatePropsType => ({
  resourceCacheUrl: state.resourceCacheUrl
})

type DisclaimerPropsType = OwnPropsType & {
  theme: ThemeType
  resourceCacheUrl: string | null | undefined
  dispatch: Dispatch<StoreActionType>
}

const DisclaimerContainer = ({ theme, resourceCacheUrl, navigation, route, dispatch }: DisclaimerPropsType) => {
  const { cityCode, languageCode } = route.params
  const request = useCallback(async () => {
    const apiUrl = await determineApiUrl()
    return createDisclaimerEndpoint(apiUrl).request({
      city: cityCode,
      language: languageCode
    })
  }, [cityCode, languageCode])
  const { data: disclaimer, error, loading, refresh } = useLoadFromEndpoint<PageModel>(request)
  useLogError(error)

  const navigateToLinkProp = (url: string, language: string, shareUrl: string) => {
    const navigateTo = createNavigate(dispatch, navigation)
    navigateToLink(url, navigation, language, navigateTo, shareUrl)
  }

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
        <Disclaimer
          resourceCacheUrl={resourceCacheUrl}
          disclaimer={disclaimer}
          theme={theme}
          navigateToLink={navigateToLinkProp}
          language={languageCode}
        />
      )}
      <SiteHelpfulBox navigateToFeedback={navigateToFeedback} theme={theme} />
    </LayoutedScrollView>
  )
}

export default connect(mapStateToProps)(withTheme<DisclaimerPropsType>(DisclaimerContainer))
