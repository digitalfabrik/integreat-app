// @flow

import { translate, type TFunction } from 'react-i18next'
import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import Language from './assets/Language.svg'
import Offers from './assets/Offers.svg'
import Search from './assets/Search.svg'
import Events from './assets/Events.svg'
import type { ThemeType } from '../../modules/theme/constants/theme'
import withTheme from '../../modules/theme/hocs/withTheme'
import { Switch, FlatList, Dimensions } from 'react-native'
import styled, { type StyledComponent } from 'styled-components/native'
import AppSettings from '../../modules/settings/AppSettings'
import SettingItem from '../settings/components/SettingItem'
import SlideContent, { type SlideContentType } from './SlideContent'
import SentryIntegration from '../../modules/app/SentryIntegration'
import type { ButtonType } from './SlideFooter'
import SlideFooter from './SlideFooter'

const Container: StyledComponent<{| width: number |}, {}, *> = styled.View`
  display: flex;
  flex-direction: column;
  width: ${props => props.width};
  height: 100%;
  justify-content: space-between;
`

const ImageContent = styled.Image`
  justify-content: center;
  align-self: center;
  width: 65%;
  height: 65%;
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
  _flatList: {current: null | React$ElementRef<FlatList<SlideContentType>>}

  constructor (props: PropsType) {
    super(props)
    this.state = {
      slideCount: this.slides().length,
      currentSlide: 0,
      allowPushNotifications: false,
      useLocationAccess: false,
      width: Dimensions.get('window').width
    }
    this._appSettings = new AppSettings()
    this._flatList = React.createRef()
  }

  renderImageContent = (image: number) => (): React.Node => <ImageContent source={image} />

  slides = (): Array<SlideContentType> => {
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

  nextSlide = (index: number) => {
    if (!this._flatList.current) {
      throw Error('ref not correctly set')
    }
    this._flatList.current.scrollToIndex({ index: ++index, viewOffset: 0 })
    this.setState(prevState => ({ currentSlide: ++prevState.currentSlide }))
  }

  lastSlide = () => {
    if (!this._flatList.current) {
      throw Error('ref not correctly set')
    }
    this._flatList.current.scrollToEnd()
    this.setState(prevState => ({ currentSlide: prevState.slideCount - 1 }))
  }

  goToSlide = (index: number) => {
    if (!this._flatList.current) {
      throw Error('ref not correctly set')
    }
    this._flatList.current.scrollToIndex({ index, viewOffset: 0 })
    this.setState({ currentSlide: index })
  }

  skipButton = (): ButtonType => ({
    label: this.props.t('skip'),
    onPress: this.lastSlide
  })

  refuseButton = (): ButtonType => ({
    label: this.props.t('refuse'),
    onPress: this.onRefuse
  })

  nextButton = (currentIndex: number): ButtonType => ({
    label: this.props.t('next'),
    onPress: () => this.nextSlide(currentIndex)
  })

  acceptButton = (): ButtonType => ({
    label: this.props.t('accept'),
    onPress: this.onAccept
  })

  renderSlide = ({ item }: { item: SlideContentType }) => {
    return <SlideContent item={item} theme={this.props.theme} width={this.state.width} />
  }

  onViewableItemsChanged = ({ viewableItems }: {| viewableItems: Array<{}> |}) => {
    if (viewableItems.length === 1) {
      this.setState({ currentSlide: viewableItems[0].index })
    }
  }

  renderFooter = () => {
    const { theme } = this.props
    const { slideCount, currentSlide } = this.state
    const leftButton = currentSlide === slideCount - 1 ? this.refuseButton() : this.skipButton()
    const rightButton = currentSlide === slideCount - 1 ? this.acceptButton() : this.nextButton(currentSlide)

    return <SlideFooter leftButton={leftButton} rightButton={rightButton} slideCount={slideCount}
                        currentSlide={currentSlide} goToSlide={this.goToSlide} theme={theme} />
  }

  render () {
    return <Container width={this.state.width}>
      <FlatList ref={this._flatList} data={this.slides()} horizontal pagingEnabled
                viewabilityConfig={{ itemVisiblePercentThreshold: 51, minimumViewTime: 0 }}
                onViewableItemsChanged={this.onViewableItemsChanged} showsHorizontalScrollIndicator={false}
                bounces={false} renderItem={this.renderSlide} />
      {this.renderFooter()}
    </Container>
  }
}

export default translate('intro')(withTheme()(Intro))
