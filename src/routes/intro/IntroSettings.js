// @flow

import * as React from 'react'
import type { ThemeType } from '../../modules/theme/constants/theme'
import type TFunction from 'react-i18next'
import styled, { StyledComponent } from 'styled-components/native'

const Padding = styled.View`
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

type PropsType = {|
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

  render () {
    const { theme, t } = this.props
    return <Padding>
      <MainText theme={theme}>Durch Klicken auf "Akzeptieren" erlaube ich der Integreat-App, ...</MainText>
      {this.renderItem('Push-Benachrichtigungen',
        '... mir Push-Benachrichtigungen über die neuesten lokalen News zu senden')}
      {this.renderItem('Orte Vorschlagen',
        '... mir mithilfe meines GPS-Standorts nahegelegene Orte vorzuschlagen')}
      {this.renderItem('App-Stabilität verbessern',
        '... mit dem automatischen senden von Absturzberichten Integreat zu verbessern')}
    </Padding>
  }
}

export default IntroSettings
