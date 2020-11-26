// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { createDisclaimerEndpoint, PageModel, Payload } from 'api-client'
import type { ThemeType } from '../../modules/theme/constants'
import type { StateType } from '../../modules/app/StateType'
import type { NavigationStackProp } from 'react-navigation-stack'
import withTheme from '../../modules/theme/hocs/withTheme'
import Disclaimer from './Disclaimer'
import FailureContainer from '../../modules/error/containers/FailureContainer'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../modules/app/StoreActionType'
import { RefreshControl, ScrollView } from 'react-native'
import { LOADING_TIMEOUT } from '../../modules/common/constants'
import determineApiUrl from '../../modules/endpoint/determineApiUrl'
import type { FeedbackInformationType } from '../feedback/containers/FeedbackModalContainer'
import SiteHelpfulBox from '../../modules/common/components/SiteHelpfulBox'
import createNavigateToFeedbackModal from '../../modules/app/createNavigateToFeedbackModal'

type OwnPropsType = {| navigation: NavigationStackProp<*> |}

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
  navigation: NavigationStackProp<*>,
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
    const { navigation, city } = this.props
    const feedbackInformation: FeedbackInformationType = {
      type: 'Disclaimer',
      cityCode: city,
      isPositiveFeedback,
      path: this.state.disclaimer?.path
    }

    navigation.navigate('FeedbackModal', { ...feedbackInformation })
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
    const { theme, navigation, city, language, resourceCacheUrl } = this.props
    const { disclaimer, error, timeoutExpired } = this.state

    if (error) {
      return <ScrollView refreshControl={<RefreshControl onRefresh={this.loadDisclaimer} refreshing={false} />}
                         contentContainerStyle={{ flexGrow: 1 }}>
        <FailureContainer error={error} tryAgain={this.loadDisclaimer} />
      </ScrollView>
    }

    if (!disclaimer) {
      return timeoutExpired
        ? <ScrollView refreshControl={<RefreshControl refreshing />} contentContainerStyle={{ flexGrow: 1 }} />
        : null
    }

    return <ScrollView refreshControl={<RefreshControl onRefresh={this.loadDisclaimer} refreshing={false} />}
                       contentContainerStyle={{ flexGrow: 1 }}>
      <Disclaimer resourceCacheUrl={resourceCacheUrl}
                  disclaimer={disclaimer}
                  theme={theme}
                  navigation={navigation}
                  city={city}
                  language={language} />
      <SiteHelpfulBox navigateToFeedback={this.navigateToFeedback} theme={theme} />
    </ScrollView>
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTheme(DisclaimerContainer)
)
