import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import Icon from './base/Icon'

const NoteBox = styled.View`
  background-color: ${props => props.theme.legacy.colors.warningColor};
  margin-top: 12px;
  padding: 12px;
  flex-direction: row;
`

const NoteText = styled.Text`
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  font-size: 12px;
  flex: 1;
  flex-wrap: wrap;
`

const StyledIcon = styled(Icon)`
  align-self: center;
  margin-right: 12px;
`

type NoteProps = {
  text: string
}

const Note = ({ text }: NoteProps): ReactElement => {
  const theme = useTheme()
  return (
    <NoteBox>
      <StyledIcon
        color={theme.legacy.isContrastTheme ? theme.legacy.colors.backgroundColor : theme.legacy.colors.textColor}
        source='alert-circle-outline'
      />
      <NoteText>{text}</NoteText>
    </NoteBox>
  )
}

export default Note
