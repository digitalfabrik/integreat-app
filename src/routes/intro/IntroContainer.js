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

type PropsType = {| t: TFunction, navigation: NavigationScreenProp<*>, theme: ThemeType |}

class Intro extends React.Component<PropsType> {
  slides = () => {
    const colors = this.props.theme.colors
    const backgroundColor = colors.backgroundColor
    const textStyle = { color: colors.textColor }

    return [{
      key: 'search',
      title: 'search',
      titleStyle: textStyle,
      text: 'searchDescription',
      textStyle,
      image: Search,
      backgroundColor
    }, {
      key: 'events',
      title: 'events',
      titleStyle: textStyle,
      text: 'eventsDescription',
      textStyle,
      image: Events,
      backgroundColor
    }, {
      key: 'offers',
      title: 'offers',
      titleStyle: textStyle,
      text: 'offersDescription',
      textStyle,
      image: Offers,
      backgroundColor
    }, {
      key: 'languageChange',
      title: 'languageChange',
      titleStyle: textStyle,
      text: 'languageChangeDescription',
      textStyle,
      image: Language,
      backgroundColor
    }]
  }

  navigateToLanding = () => this.props.navigation.navigate('Landing')

  render () {
    const colors = this.props.theme.colors
    return <AppIntroSlider slides={this.slides()} onDone={this.navigateToLanding}
                           dotStyle={{ backgroundColor: colors.textDecorationColor }}
                           activeDotStyle={{ backgroundColor: colors.textSecondaryColor }}
                           buttonTextStyle={{ color: colors.textSecondaryColor }} />
  }
}

export default translate('intro')(withTheme()(Intro))
