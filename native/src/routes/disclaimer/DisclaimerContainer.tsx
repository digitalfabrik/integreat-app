// @flow

import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { createDisclaimerEndpoint, DISCLAIMER_ROUTE, PageModel } from 'api-client'
import type { ThemeType } from 'build-configs/ThemeType'
import type { StateType } from '../../modules/app/StateType'
import withTheme from '../../modules/theme/hocs/withTheme'
import Disclaimer from './Disclaimer'
import FailureContainer from '../../modules/error/containers/FailureContainer'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../modules/app/StoreActionType'
import { RefreshControl } from 'react-native'
import SiteHelpfulBox from '../../modules/common/components/SiteHelpfulBox'
import createNavigateToFeedbackModal from '../../modules/navigation/createNavigateToFeedbackModal'
import type { NavigationPropType, RoutePropType } from '../../modules/app/constants/NavigationTypes'
import LayoutedScrollView from '../../modules/common/containers/LayoutedScrollView'
import navigateToLink from '../../modules/navigation/navigateToLink'
import type { DisclaimerRouteType } from 'api-client/src/routes'
import createNavigate from '../../modules/navigation/createNavigate'
import { fromError } from '../../modules/error/ErrorCodes'
import { useLoadFromEndpoint } from '../../modules/endpoint/hooks/useLoadFromEndpoint'

type OwnPropsType = {|
  route: RoutePropType<DisclaimerRouteType>,
  navigation: NavigationPropType<DisclaimerRouteType>
|}

type StatePropsType = {| resourceCacheUrl: ?string |}

type PropsType = {| ...OwnPropsType, ...StatePropsType, dispatch: Dispatch<StoreActionType> |}

const mapStateToProps = (state: StateType): StatePropsType => {
  return { resourceCacheUrl: state.resourceCacheUrl }
}

type DisclaimerPropsType = {|
  ...OwnPropsType,
  theme: ThemeType,
  resourceCacheUrl: ?string,
  dispatch: Dispatch<StoreActionType>
|}

const DisclaimerContainer = ({ theme, resourceCacheUrl, navigation, route, dispatch }: DisclaimerPropsType) => {
  const { cityCode, languageCode } = route.params

  const request = useCallback(
    async (apiUrl: string) =>
      await createDisclaimerEndpoint(apiUrl).request({ city: cityCode, language: languageCode }),
    [cityCode, languageCode]
  )

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

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTheme<DisclaimerPropsType>(DisclaimerContainer)
)
