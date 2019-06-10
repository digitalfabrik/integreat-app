// @flow

import * as React from 'react'
import { Linking, Text, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import styled from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'
import type { NavigationScreenProp } from 'react-navigation'
import Caption from './Caption'
import TimeStamp from './TimeStamp'
import type Moment from 'moment'
import type { FileCacheStateType } from '../../app/StateType'
import type { NavigateToIntegreatUrlParamsType } from '../../app/createNavigateToIntegreatUrl'
import MomentContext from '../../i18n/context/MomentContext'
import RemoteContent from './RemoteContent'

const HORIZONTAL_MARGIN = 8

const Container = styled.View`
  margin: 0 ${HORIZONTAL_MARGIN}px 8px;
`

const FeedbackBox = styled.View`
  margin-top: 25px;
  padding: 15px 5px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
`

const FeedbackButtons = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
`

const HelpfulText = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  align-self: center;
`

type StateType = {|
  loading: boolean
|}

type PropType = {|
  title: string,
  content: string,
  theme: ThemeType,
  navigation: NavigationScreenProp<*>,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void,
  navigateToFeedback: (positive: boolean) => void,
  files: FileCacheStateType,
  children?: React.Node,
  language: string,
  cityCode: string,
  lastUpdate: Moment
|}

const HIJACK = /https?:\/\/(cms(-test)?\.integreat-app\.de|web\.integreat-app\.de|integreat\.app)(?!\/[^/]*\/(wp-content|wp-admin|wp-json)\/.*).*/

const FeedbackTouchableOpacity = styled(TouchableOpacity)`
  align-items: center;
`

const FeedbackText = styled(Text)`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  font-size: 12;
  margin-top: -2px;
`

class FeedbackButton extends React.Component<{| theme: ThemeType, title: string, icon: string, onPress: void => void |}> {
  render () {
    const {title, icon, theme, onPress} = this.props
    return <FeedbackTouchableOpacity onPress={onPress}>
      <Icon name={icon} size={25} type='material' reverseColor={theme.colors.textColor} reverse
            color={theme.colors.themeColor} />
      <FeedbackText theme={theme}>{title.toLowerCase()}</FeedbackText>
    </FeedbackTouchableOpacity>
  }
}

class Page extends React.Component<PropType, StateType> {
  state = {loading: true}

  renderFeedbackButtons (): React.Node {
    const {theme, navigateToFeedback} = this.props
    return <FeedbackBox theme={theme}>
      <HelpfulText theme={theme}>War diese Seite hilfreich?</HelpfulText>
      <FeedbackButtons>
        <FeedbackButton title='hilfreich' theme={theme} icon='sentiment-satisfied' onPress={() => navigateToFeedback(true)} />
        <FeedbackButton title='nicht hilfreich' theme={theme} icon='sentiment-dissatisfied'
                        onPress={() => navigateToFeedback(false)} />
      </FeedbackButtons>
    </FeedbackBox>
  }

  onLinkPress = (url: string) => {
    const {navigation, cityCode, language, navigateToIntegreatUrl} = this.props

    if (url.includes('.pdf')) {
      navigation.navigate('PDFViewModal', {url})
    } else if (url.includes('.png') || url.includes('.jpg')) {
      navigation.navigate('ImageViewModal', {url})
    } else if (HIJACK.test(url)) {
      navigateToIntegreatUrl({url, cityCode, language})
    } else {
      Linking.openURL(url).catch(err => console.error('An error occurred', err))
    }
  }

  onLoad = () => this.setState({loading: false})

  render () {
    const {title, children, content, files, theme, language, cityCode, lastUpdate} = this.props
    return <Container onLayout={this.onLayout}>
      <Caption title={title} theme={theme} />
      {children}
      <RemoteContent theme={theme} cityCode={cityCode} content={content} files={files} onLinkPress={this.onLinkPress}
                     onLoad={this.onLoad} />
      {!this.state.loading &&
      <>
        <MomentContext.Consumer>
          {momentFormatter => <TimeStamp formatter={momentFormatter} lastUpdate={lastUpdate} language={language}
                                         theme={theme} />}
        </MomentContext.Consumer>
        {this.renderFeedbackButtons()}
      </>}
    </Container>
  }
}

export default Page
