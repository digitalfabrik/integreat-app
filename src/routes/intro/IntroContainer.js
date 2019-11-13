// @flow

import { translate, type TFunction } from 'react-i18next'
import React from 'react'
import AppIntroSlider from 'react-native-app-intro-slider'
import type { NavigationScreenProp } from 'react-navigation'
import Language from './assets/Language.svg'
import Offers from './assets/Offers.svg'
import Search from './assets/Search.svg'
import Events from './assets/Events.svg'
import type { ThemeType } from '../../modules/theme/constants/theme'
import withTheme from '../../modules/theme/hocs/withTheme'
import { Dimensions, TouchableOpacity, Switch } from 'react-native'
import DefaultSlide from 'react-native-app-intro-slider/DefaultSlide'
import styled from 'styled-components/native'
import AppSettings from '../../modules/settings/AppSettings'
import SettingItem from '../settings/components/SettingItem'

const Slide = styled.View`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  padding: 32px 16px 64px;
  flex: 1;
`

const StyledHeading = styled.Text`
  width: 100%;
  font-size: 26px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
`

const SettingsContainer = styled.View`
  width: 100%;
  display: flex;
  flex: 0.5;
  flex-direction: column;
`

const Description = styled.Text`
  width: 100%;
  display: flex;
  align-self: flex-end;
  font-size: 16px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  padding: 0 24px;
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
  titleStyle: { color: string },
  text: string,
  textStyle: { color: string },
  image: number,
  backgroundColor: string
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
    const { theme, t } = this.props
    const colors = theme.colors
    const backgroundColor = colors.backgroundColor
    const textStyle = { color: colors.textColor }

    return [{
      key: 'search',
      title: t('search'),
      titleStyle: textStyle,
      text: t('searchDescription'),
      textStyle,
      image: Search,
      backgroundColor
    }, {
      key: 'events',
      title: t('events'),
      titleStyle: textStyle,
      text: t('eventsDescription'),
      textStyle,
      image: Events,
      backgroundColor
    }, {
      key: 'offers',
      title: t('offers'),
      titleStyle: textStyle,
      text: t('offersDescription'),
      textStyle,
      image: Offers,
      backgroundColor
    }, {
      key: 'languageChange',
      title: t('languageChange'),
      titleStyle: textStyle,
      text: t('languageChangeDescription'),
      textStyle,
      image: Language,
      backgroundColor
    }, {
      key: 'inquiry',
      title: t('inquiryTitle'),
      titleStyle: textStyle,
      text: t('inquiryDescription'),
      textStyle,
      image: Language,
      backgroundColor
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

  renderItem = ({ item, index }: { item: SlideType, index: number}) => {
    const { t, theme } = this.props
    const themeColor = theme.colors.themeColor
    const { allowPushNotifications, useLocationAccess } = this.state
    if (index === this.slides().length - 1) {
      return <Slide>
        <StyledHeading theme={theme}>{item.title}</StyledHeading>
        <SettingsContainer>
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
        </SettingsContainer>
        <Description theme={theme}>{t('sentryDescription')}</Description>
      </Slide>
    }
    return <DefaultSlide item={item} index={index} dimensions={Dimensions.get('window')} />
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
