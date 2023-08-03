import React, { ReactElement } from 'react'
import { Button } from 'react-native-elements'
import { useTheme } from 'styled-components/native'

type ButtonSpecificProps = {
  type: 'primary' | 'clear'
  disabled?: boolean
}

// | {
//     type: 'tile'
//     icon: string
//     active?: boolean
//   }

type TextButtonProps = {
  text: string
  onPress: () => Promise<void> | void
  style?: string
} & ButtonSpecificProps

const TextButton = ({ text, onPress, ...props }: TextButtonProps): ReactElement => {
  const theme = useTheme()

  switch (props.type) {
    default:
      return (
        <Button
          onPress={onPress}
          title={text}
          disabled={props.disabled}
          titleStyle={{
            color: theme.colors.textColor,
          }}
          buttonStyle={{
            backgroundColor: props.type === 'primary' ? theme.colors.themeColor : theme.colors.backgroundColor,
            borderRadius: 8,
          }}
        />
      )
  }
}

export default TextButton
