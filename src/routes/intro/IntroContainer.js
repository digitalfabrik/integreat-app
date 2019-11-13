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
import { TouchableOpacity, Switch } from 'react-native'
import styled from 'styled-components/native'
import AppSettings from '../../modules/settings/AppSettings'
import SettingItem from '../settings/components/SettingItem'
import SlideContent from './SlideContent'

const CenteredImage = styled.Image`
  align-self: center;
`

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
`

const ButtonContainer = styled.View`
  padding: 12px;
`

const AcceptButtonContainer = styled(ButtonContainer)`
  background-color: ${props => props.theme.colors.themeColor};
`

type SlideType = {|
  key: string,
  title: string,
  text: string,
  image?: number
|}
type PropsType = {| t: TFunction, navigation: NavigationScreenProp<*>, theme: ThemeType |}
type StateType = {| isLastSlide: boolean, allowPushNotifications: boolean, useLocationAccess: boolean |}

class Intro extends React.Component<PropsType, StateType> {
  appIntroSlider: {current: null | React$ElementRef<AppIntroSlider>}
  appSettings: AppSettings

  constructor (props: PropsType) {
    super(props)
    this.state = { isLastSlide: false, allowPushNotifications: false, useLocationAccess: false }
    this.appIntroSlider = React.createRef()
    this.appSettings = new AppSettings()
  }

  slides = (): Array<SlideType> => {
    const { t } = this.props

    return [{
      key: 'search',
      title: t('search'),
      text: t('searchDescription'),
      image: Search
    }, {
      key: 'events',
      title: t('events'),
      text: t('eventsDescription'),
      image: Events
    }, {
      key: 'offers',
      title: t('offers'),
      text: t('offersDescription'),
      image: Offers
    }, {
      key: 'languageChange',
      title: t('languageChange'),
      text: t('languageChangeDescription'),
      image: Language
    }, {
      key: 'inquiry',
      title: t('inquiryTitle'),
      text: t('inquiryDescription')
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

  renderItem = ({ item, index }: { item: SlideType, index: number}) => {
    const { t, theme } = this.props
    const isInquirySlide = index === this.slides().length - 1
    return <SlideContent title={t(item.title)} description={t(item.text)} theme={theme}>
      {isInquirySlide
        ? this.renderSettings()
        : <CenteredImage source={item.image} />
      }
    </SlideContent>
  }

  onAccept = async () => {
    this.onDone(true)
  }

  onRefuse = async () => {
    this.onDone(false)
  }

  onDone = async (errorTracking: boolean) => {
    if (errorTracking) {
      // TODO install sentry
    }

    const { allowPushNotifications } = this.state
    await this.appSettings.setSettings({ errorTracking, allowPushNotifications })
    this.props.navigation.navigate('Landing')
  }

  onSlideChange = (index: number) =>
    this.setState({ isLastSlide: index === this.slides().length - 1 })

  onSkip = () => {
    if (!this.appIntroSlider.current) {
      throw Error()
    }
    this.appIntroSlider.current.goToSlide(this.slides().length - 1)
    this.setState({ isLastSlide: true })
  }

  renderRefuseButton = () => {
    const { t, theme } = this.props
    return <ButtonContainer>
      <TouchableOpacity onPress={this.onRefuse}>
        <ButtonText theme={theme}>{t('refuse')}</ButtonText>
      </TouchableOpacity>
    </ButtonContainer>
  }

  renderAcceptButton = () => {
    const { theme, t } = this.props
    return <AcceptButtonContainer theme={theme}>
      <TouchableOpacity onPress={this.onAccept}>
        <ButtonText theme={theme}>{t('accept')}</ButtonText>
      </TouchableOpacity>
    </AcceptButtonContainer>
  }

  render () {
    const { theme, t } = this.props
    const colors = theme.colors
    return <AppIntroSlider ref={this.appIntroSlider} slides={this.slides()} showSkipButton skipLabel={t('skip')}
                           nextLabel={t('next')} renderItem={this.renderItem} renderPrevButton={this.renderRefuseButton}
                           onSlideChange={this.onSlideChange} renderDoneButton={this.renderAcceptButton}
                           onSkip={this.onSkip} showPrevButton={this.state.isLastSlide}
                           dotStyle={{ backgroundColor: colors.textDecorationColor }}
                           activeDotStyle={{ backgroundColor: colors.textSecondaryColor }}
                           buttonTextStyle={{ color: colors.textColor }} backgroundColor={colors.backgroundColor} />
  }
}

export default translate('intro')(withTheme()(Intro))
