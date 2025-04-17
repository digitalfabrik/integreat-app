import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { NoteIcon } from '../assets'
import { useContrastTheme } from '../hooks/useContrastTheme'
import Icon from './base/Icon'

const NoteContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.warningColor};
  padding: 12px;
  gap: 12px;
  align-items: center;
`

const NoteText = styled.span<{ $isContrastTheme: boolean }>`
  font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
  color: ${props => (props.$isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textColor)};
`

const StyledIcon = styled(Icon)<{ $isContrastTheme: boolean }>`
  color: ${props => props.$isContrastTheme && props.theme.colors.backgroundColor};
`

type NoteProps = {
  text: string
}

const Note = ({ text }: NoteProps): ReactElement => {
  const { isContrastTheme } = useContrastTheme()
  return (
    <NoteContainer>
      <StyledIcon $isContrastTheme={isContrastTheme} src={NoteIcon} />
      <NoteText $isContrastTheme={isContrastTheme}>{text}</NoteText>
    </NoteContainer>
  )
}

export default Note
