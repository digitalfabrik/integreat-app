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
import { Dimensions, View } from 'react-native'
import DefaultSlide from 'react-native-app-intro-slider/DefaultSlide'
import styled from 'styled-components/native'

const Content = styled.View`
  justifyContent: space-around;
  alignItems: center;
  flex: 1;
  width: ${Dimensions.get('window').width};
`
const StyledText = styled.Text`
  fontSize: 16;
  textAlign: center;
`
const StyledHeading = styled.Text`
  fontSize: 26;
`

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.backgroundAccentColor}
`

const AcceptButtonContainer = styled.View`
  position: absolute;
  right: 0;
  background-color: ${props => props.theme.colors.themeColor};

`
const AcceptButton = styled.TouchableOpacity`
  flex: 1
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
type StateType = {| isLastSlide: boolean |}

class Intro extends React.Component<PropsType, StateType> {
  appIntroSlider: {current: null | React$ElementRef<AppIntroSlider>}
  constructor (props: PropsType) {
    super(props)
    this.state = { isLastSlide: false }
    this.appIntroSlider = React.createRef()
  }
  slides = (): Array<SlideType> => {
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
    }, {
      key: 'questions',
      title: 'languageChange',
      titleStyle: textStyle,
      text: 'languageChangeDescription',
      textStyle,
      image: Language,
      backgroundColor
    }]
  }

  renderItem = ({ item, index }: { item: SlideType, index: number}) => {
    if (index === this.slides().length - 1) {
      return <Content>
        <StyledHeading>SOme</StyledHeading>
      </Content>
    }
    return <DefaultSlide item={item} index={index} dimensions={Dimensions.get('window')} />
  }

  onDone = () => {
    this.props.navigation.navigate('Landing')
  }

  onSlideChange = (index: number, lastIndex: number) =>
    this.setState({ isLastSlide: index === this.slides().length - 1 })
  onSkip = () => {
    if (!this.appIntroSlider.current) {
      throw Error()
    }
    this.appIntroSlider.current.goToSlide(this.slides().length - 1)
    this.setState({ isLastSlide: true })
  }

  render () {
    const colors = this.props.theme.colors
    return <AppIntroSlider ref={this.appIntroSlider} slides={this.slides()} onDone={this.onDone} showSkipButton
                           renderItem={this.renderItem} doneLabel={'Accept'}
                           onSlideChange={this.onSlideChange}
                           onSkip={this.onSkip} showPrevButton={this.state.isLastSlide}
                           dotStyle={{ backgroundColor: colors.textDecorationColor }}
                           activeDotStyle={{ backgroundColor: colors.textSecondaryColor }}
                           buttonTextStyle={{ color: colors.textSecondaryColor }} />
  }
}

export default translate('intro')(withTheme()(Intro))
