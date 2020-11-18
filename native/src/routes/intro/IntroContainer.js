// @flow

import { withTranslation, type TFunction } from 'react-i18next'
import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation-stack'
import type { ThemeType } from '../../modules/theme/constants'
import withTheme from '../../modules/theme/hocs/withTheme'
import { FlatList, Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import AppSettings from '../../modules/settings/AppSettings'
import SlideContent, { type SlideContentType } from './SlideContent'
import initSentry from '../../modules/app/initSentry'
import SlideFooter from './footer/SlideFooter'
import type { ViewToken } from 'react-native/Libraries/Lists/ViewabilityHelper'
import CustomizableIntroSettings from './CustomizableIntroSettings'
import IntroSettings from './IntroSettings'
import type { StateType as ReduxStateType } from '../../modules/app/StateType'
import { connect } from 'react-redux'
import { requestLocationPermission } from '../../modules/app/LocationPermissionManager'
import buildConfig, { buildConfigAssets } from '../../modules/app/constants/buildConfig'
import { requestPushNotificationPermission } from '../../modules/push-notifications/PushNotificationsManager'

const Container: StyledComponent<{ width: number }, {}, *> = styled.View`
  display: flex;
  flex-direction: column;
  width: ${props => props.width}px;
  height: 100%;
  justify-content: space-between;
`

const AppIcon = styled.Image`
  justify-content: center;
  align-self: center;
  flex: 1;
  height: 40%;
  width: 40%;
  resize-mode: contain;
`

const ImageContent = styled.Image`
  justify-content: center;
  align-self: center;
  flex: 1;
  height: 100%;
  width: 60%;
  resize-mode: contain;
`

type PropsType = {|
  t: TFunction,
  navigation: NavigationScreenProp<*>,
  theme: ThemeType,
  language: string,
  dispatch: () => void
|}

export type IntroSettingsType = {|
  allowPushNotifications: boolean,
  proposeNearbyCities: boolean,
  errorTracking: boolean
|}

type StateType = {|
  slideCount: number,
  currentSlide: number,
  customizableSettings: boolean,
  width: number,
  ...IntroSettingsType
|}

class Intro extends React.Component<PropsType, StateType> {
  _appSettings: AppSettings
  _flatList: {current: null | React$ElementRef<typeof FlatList>}

  constructor (props: PropsType) {
    super(props)
    this.state = {
      slideCount: this.slides().length,
      currentSlide: 0,
      customizableSettings: false,
      allowPushNotifications: false,
      proposeNearbyCities: false,
      errorTracking: false,
      width: Dimensions.get('window').width
    }
    this._appSettings = new AppSettings()
    this._flatList = React.createRef()
    Dimensions.addEventListener('change',
      (event: { window: { width: number }}) => this.setState({ width: event.window.width })
    )
  }

  renderAppIcon = () => (): React.Node => <AppIcon source={buildConfigAssets().appIcon} />
  renderImageContent = (image: number) => (): React.Node => <ImageContent source={image} />

  slides = (): Array<SlideContentType> => {
    const icons = buildConfigAssets().intro

    const { t } = this.props
    return [{
      key: 'integreat',
      title: t('appName', { appName: buildConfig().appName }),
      description: t('appDescription', { appName: buildConfig().appName }),
      renderContent: this.renderAppIcon()
    }, {
      key: 'search',
      title: t('search'),
      description: t('searchDescription'),
      renderContent: this.renderImageContent(icons.search)
    }, {
      key: 'events',
      title: t('events'),
      description: t('eventsDescription'),
      renderContent: this.renderImageContent(icons.events)
    }, {
      key: 'offers',
      title: t('offers'),
      description: t('offersDescription'),
      renderContent: this.renderImageContent(icons.offers)
    }, {
      key: 'languageChange',
      title: t('languageChange'),
      description: t('languageChangeDescription'),
      renderContent: this.renderImageContent(icons.language)
    }, {
      key: 'inquiry',
      title: t('inquiryTitle'),
      renderContent: this.renderSettings
    }]
  }

  toggleCustomizeSettings = () => this.setState(prevState =>
    ({ customizableSettings: !prevState.customizableSettings }))

  toggleAllowPushNotifications = () => this.setState(prevState =>
    ({ allowPushNotifications: !prevState.allowPushNotifications }))

  toggleProposeCities = () => this.setState(prevState => ({ proposeNearbyCities: !prevState.proposeNearbyCities }))

  toggleErrorTracking = () => this.setState(prevState => ({ errorTracking: !prevState.errorTracking }))

  renderSettings = () => {
    const { customizableSettings, allowPushNotifications, proposeNearbyCities, errorTracking } = this.state
    const { language, theme, t } = this.props
    if (customizableSettings) {
      return <CustomizableIntroSettings allowPushNotifications={allowPushNotifications}
                                        toggleSetAllowPushNotifications={this.toggleAllowPushNotifications}
                                        proposeNearbyCities={proposeNearbyCities}
                                        toggleProposeNearbyCities={this.toggleProposeCities}
                                        errorTracking={errorTracking}
                                        toggleErrorTracking={this.toggleErrorTracking} theme={theme} t={t} />
    } else {
      return <IntroSettings theme={theme} language={language} t={t} />
    }
  }

  onDone = async ({
    errorTracking: sentry, allowPushNotifications: pushNotifications, proposeNearbyCities: nearbyCities
  }: $Shape<IntroSettingsType>) => {
    const errorTracking = sentry !== undefined ? sentry : this.state.errorTracking
    const proposeNearbyCities = nearbyCities !== undefined ? nearbyCities : this.state.proposeNearbyCities
    const allowPushNotifications =
      pushNotifications !== undefined ? pushNotifications : this.state.allowPushNotifications

    try {
      if (errorTracking) {
        initSentry()
      }

      if (proposeNearbyCities) {
        await requestLocationPermission()
      }

      if (allowPushNotifications) {
        await requestPushNotificationPermission(buildConfig().featureFlags)
      }
    } catch (e) {
      console.warn(e)
    }
    await this._appSettings.setSettings({ errorTracking, allowPushNotifications, proposeNearbyCities })
    this._appSettings.setIntroShown()
    this.props.navigation.navigate('Landing')
  }

  goToSlide = (index: number) => {
    this.setState({ customizableSettings: false })
    if (!this._flatList.current) {
      throw Error('ref not correctly set')
    }
    this._flatList.current.scrollToIndex({ index })
  }

  renderSlide = ({ item }: { item: SlideContentType }) => {
    return <SlideContent item={item} theme={this.props.theme} width={this.state.width} />
  }

  onViewableItemsChanged = ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    if (viewableItems.length === 1) {
      if (viewableItems[0].index !== null) {
        this.setState({ currentSlide: viewableItems[0].index })
      }
    }
  }

  render () {
    const { theme, t } = this.props
    const { customizableSettings, slideCount, currentSlide, width } = this.state
    return <Container width={width}>
      <FlatList ref={this._flatList} data={this.slides()} horizontal pagingEnabled
                viewabilityConfig={{ itemVisiblePercentThreshold: 51, minimumViewTime: 0.1 }}
                onViewableItemsChanged={this.onViewableItemsChanged} showsHorizontalScrollIndicator={false}
                bounces={false} renderItem={this.renderSlide} />
      <SlideFooter slideCount={slideCount} onDone={this.onDone} toggleCustomizeSettings={this.toggleCustomizeSettings}
                   customizableSettings={customizableSettings} currentSlide={currentSlide} goToSlide={this.goToSlide}
                   theme={theme} t={t} />
    </Container>
  }
}

const mapStateToProps = (state: ReduxStateType): {| language: string |} => ({ language: state.contentLanguage })
type ConnectType = {| language: string, dispatch: () => void |}

export default connect<ConnectType, {||}, _, _, _, _>(mapStateToProps)(
  withTranslation(['intro', 'settings'])(
    withTheme(Intro)
  )
)
