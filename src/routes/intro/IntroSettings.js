// @flow

import * as React from 'react'
import type { ThemeType } from '../../modules/theme/constants/theme'
import type TFunction from 'react-i18next'
import styled, { type StyledComponent } from 'styled-components/native'
import openPrivacyPolicy from '../settings/openPrivacyPolicy'

const Padding: StyledComponent<{}, ThemeType, *> = styled.View`
  flex: 1;
  padding: 10px;
  flex-direction: column;
`

const Item: StyledComponent<{}, ThemeType, *> = styled.View`
  padding: 8px 16px;
  flex-direction: column;
`

const ItemContainer = styled.View`
  flex: 4;
`

const MainText: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
`

const Description = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textColor};
`

const LinkContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
`

const Link = styled.Text`
  color: blue;
  align-self: center;
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
      <ItemContainer>
        <MainText theme={theme}>Durch Klicken auf "Akzeptieren" erlaube ich der Integreat-App, ...</MainText>
        {this.renderItem('Push-Benachrichtigungen',
          '... mir Push-Benachrichtigungen über die neuesten lokalen News zu senden')}
        {this.renderItem('Orte Vorschlagen',
          '... mir mithilfe meines GPS-Standorts nahegelegene Orte vorzuschlagen')}
        {this.renderItem('App-Stabilität verbessern',
          '... mit dem automatischen senden von Absturzberichten Integreat zu verbessern')}
      </ItemContainer>
      <LinkContainer>
        <Link onPress={this.showPrivacyPolicy}>Privacy Policy</Link>
      </LinkContainer>
    </Padding>
  }
}

export default IntroSettings
