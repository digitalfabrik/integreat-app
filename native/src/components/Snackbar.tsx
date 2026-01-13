import React, { ReactElement } from 'react'
import { Animated, StyleSheet } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import Text from './base/Text'

const Container = styled(Animated.View)<{ row: boolean }>`
  background-color: ${props => props.theme.colors.onSurfaceVariant};
  flex-direction: ${props => (props.row ? 'row' : 'column')};
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  min-height: 70px;
`
const ActionContainer = styled.View<{ row: boolean }>`
  flex-direction: ${props => (props.row ? 'row' : 'column')};
  justify-content: space-around;
  align-items: center;
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
  const theme = useTheme()

  const styles = StyleSheet.create({
    message: {
      paddingHorizontal: 10,
      color: theme.colors.background,
      flexShrink: 1,
    },
    action: {
      color: theme.colors.secondary,
      textAlign: 'center',
      padding: 10,
    },
  })
  return (
    <Container row={horizontal}>
      <Text
        variant='body1'
        role='alert'
        style={[styles.message, { textAlign: negativeAction || positiveAction ? 'auto' : 'center' }]}>
        {text}
      </Text>
      <ActionContainer row={!horizontal}>
        {/* Using onPress={() => negativeAction.onPress()} to not pass in any parameter, onPress={negativeAction.onPress} would pass in the event as parameter */}
        {/* https://github.com/digitalfabrik/integreat-app/pull/3158/files#r2190224651 */}
        {negativeAction && (
          <Text variant='button' style={styles.action} onPress={() => negativeAction.onPress()}>
            {negativeAction.label}
          </Text>
        )}
        {positiveAction && (
          <Text variant='button' style={styles.action} onPress={() => positiveAction.onPress()}>
            {positiveAction.label}
          </Text>
        )}
      </ActionContainer>
    </Container>
  )
}

export default Snackbar
