// @flow

import { translate, type TFunction } from 'react-i18next'
import React from 'react'
import AppIntroSlider from 'react-native-app-intro-slider'
import { View, Text, Image } from 'react-native'
import type { NavigationScreenProp } from 'react-navigation'

type SlideType = {|
  key: string,
  title: string,
  text: string,
  image: string,
  backgroundColor: string
|}

const slides: Array<SlideType> = [{
  key: 'somethun',
  title: 'Title 1',
  text: 'Description.\nSay something cool',
  image: '',
  backgroundColor: '#59b2ab'
},
{
  key: 'somethun-dos',
  title: 'Title 2',
  text: 'Other cool stuff',
  image: '',
  backgroundColor: '#febe29'
},
{
  key: 'somethun1',
  title: 'Rocket guy',
  text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
  image: '',
  backgroundColor: '#22bcb5'
}]

type PropsType = {| t: TFunction, navigation: NavigationScreenProp<*> |}

class Intro extends React.Component<PropsType> {
  renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.title}</Text>
        <Image source={item.image} />
        <Text>{item.text}</Text>
      </View>
    )
  }

  navigateToLanding = () => this.props.navigation.navigate('Landing')

  render () {
    return <AppIntroSlider renderItem={this.renderItem} slides={slides} onDone={this.navigateToLanding} />
  }
}

export default translate('intro')(Intro)
