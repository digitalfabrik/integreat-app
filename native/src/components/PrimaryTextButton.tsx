import React, { ReactElement } from 'react'
import { Button } from 'react-native-elements'
import { IconNode } from 'react-native-elements/dist/icons/Icon'
import styled, { useTheme } from 'styled-components/native'

const Container = styled.View<{ $padding: boolean }>`
  padding: ${props => (props.$padding ? '16px' : '0')};
`

type PrimaryTextButtonProps = {
  onPress: () => void
  text: string
  disabled?: boolean
  Icon?: IconNode
  padding?: boolean
}

const PrimaryTextButton = ({
  onPress,
  text,
  padding = true,
  disabled = false,
  Icon,
}: PrimaryTextButtonProps): ReactElement => {
  const theme = useTheme()

  return (
    <Container $padding={padding}>
      <Button
        icon={Icon}
        onPress={onPress}
        title={text}
        disabled={disabled}
        titleStyle={{
          color: theme.colors.textColor,
          fontFamily: theme.fonts.native.contentFontBold,
          fontSize: 14,
        }}
        buttonStyle={{
          backgroundColor: theme.colors.themeColor,
          borderRadius: 8,
        }}
      />
    </Container>
  )
}

export default PrimaryTextButton
