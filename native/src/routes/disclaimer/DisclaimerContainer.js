// @flow

import React, { useCallback, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { createDisclaimerEndpoint, PageModel, Payload } from 'api-client'
import type { ThemeType } from 'build-configs/ThemeType'
import type { StateType } from '../../modules/app/StateType'
import withTheme from '../../modules/theme/hocs/withTheme'
import Disclaimer from './Disclaimer'
import FailureContainer from '../../modules/error/containers/FailureContainer'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../modules/app/StoreActionType'
import { RefreshControl } from 'react-native'
import determineApiUrl from '../../modules/endpoint/determineApiUrl'
import SiteHelpfulBox from '../../modules/common/components/SiteHelpfulBox'
import createNavigateToFeedbackModal from '../../modules/navigation/createNavigateToFeedbackModal'
import type { NavigationPropType, RoutePropType } from '../../modules/app/constants/NavigationTypes'
import LayoutedScrollView from '../../modules/common/containers/LayoutedScrollView'
import navigateToLink from '../../modules/navigation/navigateToLink'
import type { DisclaimerRouteType } from 'api-client/src/routes'
import createNavigate from '../../modules/navigation/createNavigate'
import { fromError } from '../../modules/error/ErrorCodes'

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
  const [disclaimer, setDisclaimer] = useState<?PageModel>(null)
  const [error, setError] = useState<?Error>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { cityCode, languageCode } = route.params

  const navigateToLinkProp = useCallback((url: string, language: string, shareUrl: string) => {
    const navigateTo = createNavigate(dispatch, navigation)
    navigateToLink(url, navigation, language, navigateTo, shareUrl)
  }, [dispatch, navigation])

  const navigateToFeedback = useCallback((isPositiveFeedback: boolean) => {
    createNavigateToFeedbackModal(navigation)({
      type: 'Disclaimer',
      cityCode,
      language: languageCode,
      isPositiveFeedback,
      path: disclaimer?.path
    })
  }, [disclaimer, cityCode, languageCode, navigation])

  const loadDisclaimer = useCallback(async () => {
    setLoading(true)

    try {
      const apiUrl = await determineApiUrl()
      const disclaimerEndpoint = createDisclaimerEndpoint(apiUrl)
      const payload: Payload<PageModel> = await disclaimerEndpoint.request({ city: cityCode, language: languageCode })

      if (payload.error) {
        setError(payload.error)
        setDisclaimer(null)
      } else {
        setDisclaimer(payload.data)
        setError(null)
      }
    } catch (e) {
      setError(e)
      setDisclaimer(null)
    } finally {
      setLoading(false)
    }
  }, [cityCode, languageCode, setError, setDisclaimer, setLoading])

  useEffect(() => {
    loadDisclaimer().catch(e => setError(e))
  }, [])

  if (error) {
    return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={loadDisclaimer} refreshing={loading} />}>
      <FailureContainer errorMessage={error.message} code={fromError(error)} tryAgain={loadDisclaimer} />
    </LayoutedScrollView>
  }

  if (!resourceCacheUrl) {
    setError(new Error('Resource cache url must be defined!'))
  }

  return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={loadDisclaimer} refreshing={loading} />}>
    {disclaimer && resourceCacheUrl && <Disclaimer resourceCacheUrl={resourceCacheUrl}
                                                   disclaimer={disclaimer}
                                                   theme={theme}
                                                   navigateToLink={navigateToLinkProp}
                                                   language={languageCode} />}
    <SiteHelpfulBox navigateToFeedback={navigateToFeedback} theme={theme} />
  </LayoutedScrollView>
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTheme(DisclaimerContainer)
)
