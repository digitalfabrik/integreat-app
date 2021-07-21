import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import {
  createDisclaimerEndpoint,
  DISCLAIMER_ROUTE,
  fromError,
  PageModel,
  DisclaimerRouteType,
  useLoadFromEndpoint
} from 'api-client'
import { ThemeType } from 'build-configs'
import { StateType } from '../redux/StateType'
import withTheme from '../hocs/withTheme'
import Disclaimer from './Disclaimer'
import FailureContainer from '../components/FailureContainer'
import { Dispatch } from 'redux'
import { StoreActionType } from '../redux/StoreActionType'
import { RefreshControl } from 'react-native'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import LayoutedScrollView from '../components/LayoutedScrollView'
import navigateToLink from '../navigation/navigateToLink'
import createNavigate from '../navigation/createNavigate'
import { determineApiUrl } from '../utils/helpers'

type OwnPropsType = {
  route: RoutePropType<DisclaimerRouteType>
  navigation: NavigationPropType<DisclaimerRouteType>
}
type StatePropsType = {
  resourceCacheUrl: string | null | undefined
}

const mapStateToProps = (state: StateType): StatePropsType => {
  return {
    resourceCacheUrl: state.resourceCacheUrl
  }
}

type DisclaimerPropsType = OwnPropsType & {
  theme: ThemeType
  resourceCacheUrl: string | null | undefined
  dispatch: Dispatch<StoreActionType>
}

const DisclaimerContainer = ({ theme, resourceCacheUrl, navigation, route, dispatch }: DisclaimerPropsType) => {
  const { cityCode, languageCode } = route.params
  const request = useCallback(async () => {
    const apiUrl = await determineApiUrl()
    return await createDisclaimerEndpoint(apiUrl).request({
      city: cityCode,
      language: languageCode
    })
  }, [cityCode, languageCode])
  const { data: disclaimer, error, loading, refresh } = useLoadFromEndpoint<PageModel>(request)

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
        <FailureContainer code={fromError(error)} tryAgain={refresh} />
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
