// @flow

import { translate, type TFunction } from 'react-i18next'
import * as React from 'react'
import AppIntroSlider from 'react-native-app-intro-slider'
import type { NavigationScreenProp } from 'react-navigation'
import Language from './assets/Language.svg'
import Offers from './assets/Offers.svg'
import Search from './assets/Search.svg'
import Events from './assets/Events.svg'
import type { ThemeType } from '../../modules/theme/constants/theme'
import withTheme from '../../modules/theme/hocs/withTheme'
import { TouchableOpacity, Switch, FlatList, Dimensions } from 'react-native'
import styled, { type StyledComponent } from 'styled-components/native'
import AppSettings from '../../modules/settings/AppSettings'
import SettingItem from '../settings/components/SettingItem'
import SlideContent, { type SlideType } from './SlideContent'
import SentryIntegration from '../../modules/app/SentryIntegration'
import type { ButtonType } from './SlideFooter'
import SlideFooter from './SlideFooter'

const ImageContent = styled.Image`
  justify-content: center;
  align-self: center;
  width: 65%;
  height: 65%;
`

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
`

const ButtonContainer: StyledComponent<{| backgroundColor?: string |}, ThemeType, *> = styled.View`
  padding: 12px;
  background-color: ${props => props.backgroundColor || props.theme.colors.backgroundColor};
`

type PropsType = {| t: TFunction, navigation: NavigationScreenProp<*>, theme: ThemeType |}
type StateType = {|
  slideCount: number,
  currentSlide: number,
  allowPushNotifications: boolean,
  useLocationAccess: boolean,
  width: number
|}

class Intro extends React.Component<PropsType, StateType> {
  _appSettings: AppSettings
  _flatList: {current: null | React$ElementRef<FlatList<SlideType>>}

  constructor (props: PropsType) {
    super(props)
    this.state = {
      currentSlide: 0,
      slideCount: this.slides().length,
      allowPushNotifications: false,
      useLocationAccess: false,
      width: Dimensions.get('window').width
    }
    this._appSettings = new AppSettings()
    this._flatList = React.createRef()
  }

  renderImageContent = (image: number) => (): React.Node => <ImageContent source={image} />

  slides = (): Array<SlideType> => {
    const { t } = this.props
    return [{
      key: t('search'),
      title: t('search'),
      description: t('searchDescription'),
      renderContent: this.renderImageContent(Search)
    }, {
      key: t('events'),
      title: t('events'),
      description: t('eventsDescription'),
      renderContent: this.renderImageContent(Events)
    }, {
      key: t('offers'),
      title: t('offers'),
      description: t('offersDescription'),
      renderContent: this.renderImageContent(Offers)
    }, {
      key: t('languageChange'),
      title: t('languageChange'),
      description: t('languageChangeDescription'),
      renderContent: this.renderImageContent(Language)
    }, {
      key: t('inquiry'),
      title: t('inquiryTitle'),
      description: t('inquiryDescription'),
      renderContent: this.renderSettings
    }]
  }

  setAllowPushNotifications = () => this.setState(prevState =>
    ({ allowPushNotifications: !prevState.allowPushNotifications }))

  setUseLocationAccess = () => {
    this.setState(prevState =>
      ({ useLocationAccess: !prevState.useLocationAccess }))

    if (this.state.useLocationAccess) {
      // TODO request permissions and disable again if not granted
    }
  }

  renderSettings = (): React.Node => {
    const { t, theme } = this.props
    const themeColor = theme.colors.themeColor
    const { allowPushNotifications, useLocationAccess } = this.state

    return <>
      <SettingItem title={t('pushNewsTitle')} description={t('pushNewsDescription')}
                   onPress={this.setAllowPushNotifications} theme={theme}>
        <Switch thumbColor={themeColor} trackColor={{ true: themeColor }}
                onValueChange={this.setAllowPushNotifications} value={allowPushNotifications} />
      </SettingItem>
      <SettingItem title={t('locationTitle')} description={t('locationDescription')}
                   onPress={this.setUseLocationAccess} theme={theme}>
        <Switch thumbColor={themeColor} trackColor={{ true: themeColor }}
                onValueChange={this.setUseLocationAccess} value={useLocationAccess} />
      </SettingItem>
    </>
  }

  onAccept = async () => this.onDone(true)

  onRefuse = async () => this.onDone(false)

  onDone = async (errorTracking: boolean) => {
    if (errorTracking) {
      const sentry = new SentryIntegration()
      await sentry.install()
    }

    const { allowPushNotifications, useLocationAccess } = this.state
    await this._appSettings.setSettings({ errorTracking, allowPushNotifications, useLocationAccess })
    this.props.navigation.navigate('Landing')
  }

  onSlideChange = (currentSlide: number) => this.setState({ currentSlide })
  nextSlide = () => this.setState(prevState => ({
    currentSlide: Math.max(++prevState.currentSlide, prevState.slideCount - 1)
  }))
  previousSlide = () => this.setState(prevState => ({ currentSlide: Math.min(--prevState.currentSlide, 0) }))
  lastSlide = () => this.setState({ currentSlide: this.slides().length - 1 })

  skipButton = (): ButtonType => ({
    label: this.props.t('skip'),
    onPress: this.lastSlide
  })

  refuseButton = (): ButtonType => ({
    label: this.props.t('refuse'),
    onPress: this.onRefuse
  })

  nextButton = (): ButtonType => ({
    label: this.props.t('next'),
    onPress: this.nextSlide
  })

  acceptButton = (): ButtonType => ({
    label: this.props.t('accept'),
    onPress: this.onAccept
  })

  renderSlide = ({ item }: { item: SlideType }) => {
    return <SlideContent item={item} theme={this.props.theme} width={this.state.width} />
  }

  renderFooter = () => {
    const { theme } = this.props
    const { currentSlide, slideCount } = this.state
    const leftButton = currentSlide === slideCount - 1 ? this.refuseButton() : this.skipButton()
    const rightButton = currentSlide === slideCount - 1 ? this.acceptButton() : this.nextButton()

    return <SlideFooter leftButton={leftButton} rightButton={rightButton} slideCount={slideCount}
                        currentSlide={currentSlide} leftSwipe={this.previousSlide} rightSwipe={this.nextSlide}
                        theme={theme} />
  }

  render () {
    return <FlatList ref={this._flatList} data={this.slides()} horizontal pagingEnabled
                     showsHorizontalScrollIndicator={false} bounces={false} renderItem={this.renderSlide} />
  }
}

export default translate('intro')(withTheme()(Intro))
