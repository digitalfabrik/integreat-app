import React, { ReactElement } from 'react'
import { Button } from 'react-native-elements'
import { IconNode } from 'react-native-elements/dist/icons/Icon'
import styled, { useTheme } from 'styled-components/native'

const StyledButton = styled(Button)<{ marginTop: number }>`
  background-color: ${props => props.theme.colors.themeColor};
  margin-top: ${props => props.marginTop}px;
  border-radius: 8px;
`

type PrimaryTextButtonProps = {
  onPress: () => void
  text: string
  disabled?: boolean
  marginTop?: number
  Icon?: IconNode
}

const PrimaryTextButton = ({
  onPress,
  text,
  disabled = false,
  marginTop,
  Icon,
}: PrimaryTextButtonProps): ReactElement => {
  const theme = useTheme()

  return (
    <StyledButton
      icon={Icon}
      onPress={onPress}
      title={text}
      marginTop={marginTop ?? 0}
      disabled={disabled}
      titleStyle={{
        color: theme.colors.textColor,
        fontFamily: theme.fonts.native.contentFontRegular,
      }}
    />
  )
}

export default PrimaryTextButton
