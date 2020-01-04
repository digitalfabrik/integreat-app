// @flow

import React from 'react'
import { Animated } from 'react-native'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'

const SNACKBAR_HEIGHT = 120
const ANIMATION_DURATION = 1000

const Container: StyledComponent<{ negativeAction: boolean }, ThemeType, *> = styled(Animated.View)`
  position: absolute;
  flex: 0.1;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  flex-direction: ${props => props.negativeAction ? 'column' : 'row'};
  align-items: center;
  left: 0;
  bottom: 0;
  right: 0;
  height: ${SNACKBAR_HEIGHT};
  padding: 10px;
`

const Message: StyledComponent<{}, ThemeType, *> = styled.Text`
  flex: 1;
  color: ${props => props.theme.colors.themeColor};
  font-size: 18px;
  text-align: center;
`

const ActionContainer: StyledComponent<{}, ThemeType, *> = styled.View`
  flex: 1;
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
  padding: 5px;
`

export type SnackbarActionType = {|
  label: string,
  onPress: () => void | Promise<void>
|}

export type PropsType = {|
  message: string,
  positiveAction: SnackbarActionType,
  negativeAction?: SnackbarActionType,
  theme: ThemeType
|}

type StateType = {|

|}

class Snackbar extends React.Component<PropsType, StateType> {
  _animatedValue: Animated.Value

  constructor () {
    super()
    this._animatedValue = new Animated.Value(SNACKBAR_HEIGHT)
  }

  componentDidMount () {
    Animated.timing(this._animatedValue, { toValue: 0, duration: ANIMATION_DURATION }).start()
  }

  hide = () => {
    Animated.timing(this._animatedValue, { toValue: SNACKBAR_HEIGHT, duration: ANIMATION_DURATION }).start()
  }

  onPositive = () => {
    this.hide()
    this.props.positiveAction.onPress()
  }

  onNegative = () => {
    this.hide()
    if (!this.props.negativeAction) {
      throw Error('Negative action not defined')
    }
    this.props.negativeAction.onPress()
  }

  render () {
    const { theme, message, positiveAction, negativeAction } = this.props

    return (
      <Container theme={theme} negativeAction style={{ transform: [{ translateY: this._animatedValue }] }}>
        <Message theme={theme}>{message}</Message>
        { negativeAction
          ? <ActionContainer>
            <Action theme={theme} onPress={this.onNegative}>{negativeAction.label}</Action>
            <Action theme={theme} onPress={this.onPositive}>{positiveAction.label}</Action>
          </ActionContainer>
          : <Action theme={theme} onPress={this.onPositive}>{positiveAction.label}</Action>
        }
      </Container>
    )
  }
}

export default Snackbar
