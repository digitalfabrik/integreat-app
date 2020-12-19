// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { createDisclaimerEndpoint, PageModel, Payload } from 'api-client'
import type { ThemeType } from '../../modules/theme/constants'
import type { StateType } from '../../modules/app/StateType'
import withTheme from '../../modules/theme/hocs/withTheme'
import Disclaimer from './Disclaimer'
import FailureContainer from '../../modules/error/containers/FailureContainer'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../modules/app/StoreActionType'
import { RefreshControl } from 'react-native'
import { LOADING_TIMEOUT } from '../../modules/common/constants'
import determineApiUrl from '../../modules/endpoint/determineApiUrl'
import SiteHelpfulBox from '../../modules/common/components/SiteHelpfulBox'
import createNavigateToFeedbackModal from '../../modules/app/createNavigateToFeedbackModal'
import type {
  DisclaimerRouteType,
  NavigationPropType,
  RoutePropType
} from '../../modules/app/components/NavigationTypes'
import LayoutedScrollView from '../../modules/common/components/LayoutedScrollView'
import LayoutContainer from '../../modules/layout/containers/LayoutContainer'

type OwnPropsType = {|
  route: RoutePropType<DisclaimerRouteType>,
  navigation: NavigationPropType<DisclaimerRouteType>
|}

type StatePropsType = {| city: string, language: string, resourceCacheUrl: string |}

type PropsType = {| ...OwnPropsType, ...StatePropsType, dispatch: Dispatch<StoreActionType> |}

const mapStateToProps = (state: StateType): StatePropsType => {
  if (!state.cityContent) {
    throw new Error('CityContent must not be null!')
  }
  if (state.resourceCacheUrl === null) {
    throw new Error('Resource cache Url must not be null!')
  }

  return { city: state.cityContent.city, language: state.contentLanguage, resourceCacheUrl: state.resourceCacheUrl }
}

type DisclaimerPropsType = {|
  ...OwnPropsType,
  city: string,
  language: string,
  theme: ThemeType,
  resourceCacheUrl: string,
  dispatch: Dispatch<StoreActionType>
|}

type DisclaimerStateType = {|
  disclaimer: ?PageModel,
  error: ?Error,
  timeoutExpired: boolean
|}

class DisclaimerContainer extends React.Component<DisclaimerPropsType, DisclaimerStateType> {
  constructor (props: DisclaimerPropsType) {
    super(props)
    this.state = { disclaimer: null, error: null, timeoutExpired: false }
  }

  navigateToFeedback = (isPositiveFeedback: boolean) => {
    const { navigation, city, language } = this.props
    createNavigateToFeedbackModal(navigation)({
      type: 'Disclaimer',
      cityCode: city,
      language,
      isPositiveFeedback,
      path: this.state.disclaimer?.path
    })
  }

  componentDidMount () {
    this.loadDisclaimer()
  }

  loadDisclaimer = async () => {
    const { city, language } = this.props
    this.setState({ error: null, disclaimer: null, timeoutExpired: false })
    setTimeout(() => this.setState({ timeoutExpired: true }), LOADING_TIMEOUT)

    try {
      const apiUrl = await determineApiUrl()
      const disclaimerEndpoint = createDisclaimerEndpoint(apiUrl)
      const payload: Payload<PageModel> = await disclaimerEndpoint.request({ city, language })

      if (payload.error) {
        this.setState({ error: payload.error, disclaimer: null })
      } else {
        this.setState({ error: null, disclaimer: payload.data })
      }
    } catch (e) {
      this.setState({ error: e, disclaimer: null })
    }
  }

  render () {
    const { theme, navigation, city, language, resourceCacheUrl, route } = this.props
    const { disclaimer, error, timeoutExpired } = this.state

    if (error) {
      return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={this.loadDisclaimer} refreshing={false} />}>
        <FailureContainer error={error} tryAgain={this.loadDisclaimer} />
      </LayoutedScrollView>
    }

    if (!disclaimer) {
      return timeoutExpired
        ? <LayoutedScrollView refreshControl={<RefreshControl refreshing />} />
        : <LayoutContainer />
    }

    return <LayoutedScrollView refreshControl={<RefreshControl onRefresh={this.loadDisclaimer} refreshing={false} />}>
      <Disclaimer resourceCacheUrl={resourceCacheUrl}
                  disclaimer={disclaimer}
                  theme={theme}
                  navigation={navigation}
                  route={route}
                  city={city}
                  language={language} />
      <SiteHelpfulBox navigateToFeedback={this.navigateToFeedback} theme={theme} />
    </LayoutedScrollView>
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTheme(DisclaimerContainer)
)
