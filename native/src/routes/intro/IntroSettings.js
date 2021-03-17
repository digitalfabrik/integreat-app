// @flow

import * as React from 'react'
import type { ThemeType } from 'build-configs/ThemeType'
import { type TFunction } from 'react-i18next'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import openPrivacyPolicy from '../settings/openPrivacyPolicy'
import { View } from 'react-native'
import buildConfig from '../../modules/app/constants/buildConfig'

const Padding: StyledComponent<{||}, ThemeType, *> = styled.View`
  flex: 1;
  padding: 10px;
  flex-direction: column;
  justify-content: space-between;
`

const Item: StyledComponent<{||}, ThemeType, *> = styled.View`
  padding: 16px;
  flex-direction: column;
`

const MainText: StyledComponent<{||}, ThemeType, *> = styled.Text`
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
`

const Description: StyledComponent<{||}, ThemeType, *> = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondaryColor};
`

const Link = styled.Text`
  padding: 10px;
  align-self: center;
  text-decoration: underline;
`

type PropsType = {|
  language: string,
  theme: ThemeType,
  t: TFunction
|}

class IntroSettings extends React.Component<PropsType> {
  renderItem = (title: string, text: string): React.Node => {
    const { theme } = this.props
    return (
      <Item>
        <MainText theme={theme}>{title}</MainText>
        <Description theme={theme}>{text}</Description>
      </Item>
    )
  }

  showPrivacyPolicy = () => openPrivacyPolicy(this.props.language)

  render() {
    const { theme, t } = this.props
    return (
      <Padding>
        <View>
          <MainText theme={theme}>
            {t('inquiryIntro', { accept: t('accept'), appName: buildConfig().appName })}
          </MainText>
          {this.renderItem(t('settings:pushNewsTitle'), t('pushNewsCondition'))}
          {this.renderItem(t('settings:proposeCitiesTitle'), t('proposeCitiesCondition'))}
          {this.renderItem(t('settings:sentryTitle'), t('sentryCondition', { appName: buildConfig().appName }))}
        </View>
        <View>
          <Link onPress={this.showPrivacyPolicy}>{t('privacyPolicy')}</Link>
        </View>
      </Padding>
    )
  }
}

export default IntroSettings
