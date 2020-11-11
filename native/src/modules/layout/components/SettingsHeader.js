// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import { HeaderBackButton } from 'react-navigation-stack'
import type { ThemeType } from '../../theme/constants'
import type { TFunction } from 'react-i18next'
import type { NavigationStackProp } from 'react-navigation-stack'

const Horizontal = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const HorizontalLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const BoxShadow: StyledComponent<{}, ThemeType, *> = styled.View`
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.18;
  shadow-radius: 1.00px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${props => props.theme.dimensions.native.headerHeight}px;
`

const HeaderText: StyledComponent<{}, ThemeType, *> = styled.Text`
  flex: 1;
  flex-direction: column;
  text-align-vertical: center;
  height: 50px;
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontBold};
`

type PropsType = {|
  navigation: NavigationStackProp<*>,
  t: TFunction,
  theme: ThemeType
|}

class SettingsHeader extends React.PureComponent<PropsType> {
  goBack = () => {
    this.props.navigation.goBack(null)
  }

  render () {
    return <BoxShadow theme={this.props.theme}>
      <Horizontal>
        <HorizontalLeft>
          <HeaderBackButton onPress={this.goBack} />
          <HeaderText theme={this.props.theme}>{this.props.t('settings')}</HeaderText>
        </HorizontalLeft>
      </Horizontal>
    </BoxShadow>
  }
}

export default SettingsHeader
