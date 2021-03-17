// @flow

import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../theme/constants'

const Container: StyledComponent<{}, ThemeType, *> = styled(Animated.View)`
  background-color: ${props => props.theme.colors.textSecondaryColor};
  flex-direction: column;
  align-items: center;
  padding: 10px;
`

const Message: StyledComponent<{}, ThemeType, *> = styled.Text`
  padding: 0 10px;
  color: ${props => props.theme.colors.backgroundColor};
  font-size: 18px;
  text-align: center;
`

const ActionContainer: StyledComponent<{}, ThemeType, *> = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`

const Action: StyledComponent<{}, ThemeType, *> = styled.Text`
  flex: 1;
  color: ${props => props.theme.colors.themeColor};
  font-size: 18px;
  justify-content: center;
  text-align: center;
  padding: 10px;
  font-weight: bold;
`

export type SnackbarActionType = {|
  label: string,
  onPress: () => void | Promise<void>
|}

export type PropsType = {|
  message: string,
  positiveAction: SnackbarActionType,
  negativeAction: SnackbarActionType,
  theme: ThemeType
|}

class Snackbar extends React.Component<PropsType> {
  onPositive = () => {
    this.props.positiveAction.onPress()
  }

  onNegative = () => {
    this.props.negativeAction.onPress()
  }

  render() {
    const { theme, message, positiveAction, negativeAction } = this.props

    return (
      <Container theme={theme}>
        <Message theme={theme}>{message}</Message>
        <ActionContainer>
          <Action theme={theme} onPress={this.onNegative}>
            {negativeAction.label}
          </Action>
          <Action theme={theme} onPress={this.onPositive}>
            {positiveAction.label}
          </Action>
        </ActionContainer>
      </Container>
    )
  }
}

export default Snackbar
