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
  padding: 16px;
  flex-direction: column;
`

const ItemContainer = styled.View`
  flex: 4;
`

const MainText: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
`

const Description: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondaryColor};
`

const LinkContainer = styled.View`
  flex: 1;
  justify-content: center;
`

const Link = styled.Text`
  padding-top: 20px;
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
    const { theme, t } = this.props
    return <Padding>
      <ItemContainer>
        <MainText theme={theme}>{t('inquiryIntro', { accept: t('accept') })}</MainText>
        {this.renderItem(t('pushNewsTitle'), t('pushNewsCondition'))}
        {this.renderItem(t('proposeCitiesTitle'), t('proposeCitiesCondition'))}
        {this.renderItem(t('sentryTitle'), t('sentryCondition'))}
      </ItemContainer>
      <LinkContainer>
        <Link onPress={this.showPrivacyPolicy}>{t('privacyPolicy')}</Link>
      </LinkContainer>
    </Padding>
  }
}

export default IntroSettings
