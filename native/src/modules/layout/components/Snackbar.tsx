import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

const Container = styled(Animated.View)<{ row: boolean }>`
  background-color: ${props => props.theme.colors.textSecondaryColor};
  flex-direction: ${props => (props.row ? 'row' : 'column')};
  align-items: center;
  padding: 10px;
  min-height: 70px;
`
const Message = styled.Text`
  padding: 0 10px;
  color: ${props => props.theme.colors.backgroundColor};
  font-size: 18px;
  text-align: center;
`
const ActionContainer = styled.View<{ row: boolean }>`
  flex-direction: ${props => (props.row ? 'row' : 'column')};
  justify-content: space-around;
  align-items: center;
`
const Action = styled.Text`
  flex: 1;
  color: ${props => props.theme.colors.themeColor};
  font-size: 18px;
  justify-content: center;
  text-align: center;
  padding: 10px;
  font-weight: bold;
`

export type SnackbarActionType = {
  label: string
  onPress: () => void | Promise<void>
}
export type PropsType = {
  message: string
  positiveAction?: SnackbarActionType
  negativeAction?: SnackbarActionType
}

const Snackbar = ({ message, positiveAction, negativeAction }: PropsType) => {
  const horizontal = !(positiveAction && negativeAction)
  return (
    <Container row={horizontal}>
      <Message>{message}</Message>
      <ActionContainer row={!horizontal}>
        {negativeAction && <Action onPress={negativeAction.onPress}>{negativeAction.label}</Action>}
        {positiveAction && <Action onPress={positiveAction.onPress}>{positiveAction.label}</Action>}
      </ActionContainer>
    </Container>
  )
}

export default Snackbar
