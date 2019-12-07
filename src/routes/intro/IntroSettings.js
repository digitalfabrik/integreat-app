// @flow

import * as React from 'react'
import type { ThemeType } from '../../modules/theme/constants/theme'
import type TFunction from 'react-i18next'
import styled, { type StyledComponent } from 'styled-components/native'
import openPrivacyPolicy from '../settings/openPrivacyPolicy'

const Padding: StyledComponent<{}, ThemeType, *> = styled.View`
  padding: 10px;
`

const Item: StyledComponent<{}, ThemeType, *> = styled.View`
  padding-horizontal: 16px;
  flex-direction: column;
  padding-vertical: 8px;
`

const MainText: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
`

const Description = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textColor};
`

const Link = styled.Text`
  color: blue;
`

type PropsType = {|
  language: string,
  theme: ThemeType,
  t: TFunction
|}

class IntroSettings extends React.Component<PropsType> {
  renderItem = (title: string, text: string): React.Node => {
    const { theme } = this.props
    return <Item>
      <MainText theme={theme}>{title}</MainText>
      <Description theme={theme}>{text}</Description>
    </Item>
  }

  showPrivacyPolicy = () => openPrivacyPolicy(this.props.language)

  render () {
    const { theme } = this.props
    return <Padding>
      <MainText theme={theme}>Durch Klicken auf "Akzeptieren" erlaube ich der Integreat-App, ...</MainText>
      {this.renderItem('Push-Benachrichtigungen',
        '... mir Push-Benachrichtigungen über die neuesten lokalen News zu senden')}
      {this.renderItem('Orte Vorschlagen',
        '... mir mithilfe meines GPS-Standorts nahegelegene Orte vorzuschlagen')}
      {this.renderItem('App-Stabilität verbessern',
        '... mit dem automatischen senden von Absturzberichten Integreat zu verbessern')}
      <Link onPress={this.showPrivacyPolicy}>Privacy Policy</Link>
    </Padding>
  }
}

export default IntroSettings
