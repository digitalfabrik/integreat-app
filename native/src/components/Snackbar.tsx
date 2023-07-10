import React, { ReactElement } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

const Container = styled(Animated.View)<{ row: boolean }>`
  background-color: ${props => props.theme.colors.textSecondaryColor};
  flex-direction: ${props => (props.row ? 'row' : 'column')};
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  min-height: 70px;
`
const Message = styled.Text<{ hasActions: boolean }>`
  padding: 0 10px;
  color: ${props => props.theme.colors.backgroundColor};
  font-size: 18px;
  text-align: ${props => (props.hasActions ? 'auto' : 'center')};
  flex-shrink: 1;
`
const ActionContainer = styled.View<{ row: boolean }>`
  flex-direction: ${props => (props.row ? 'row' : 'column')};
  justify-content: space-around;
  align-items: center;
`
const Action = styled.Text`
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
type SnackbarProps = {
  text: string
  positiveAction?: SnackbarActionType
  negativeAction?: SnackbarActionType
}

const Snackbar = ({ text, positiveAction, negativeAction }: SnackbarProps): ReactElement => {
  const horizontal = !(positiveAction && negativeAction)
  return (
    <Container row={horizontal}>
      <Message hasActions={!!(negativeAction || positiveAction)}>{text}</Message>
      <ActionContainer row={!horizontal}>
        {negativeAction && <Action onPress={negativeAction.onPress}>{negativeAction.label}</Action>}
        {positiveAction && <Action onPress={positiveAction.onPress}>{positiveAction.label}</Action>}
      </ActionContainer>
    </Container>
  )
}

export default Snackbar
