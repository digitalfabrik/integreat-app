import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { NoteIcon } from '../assets'
import Icon from './base/Icon'

const NoteContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.warningColor};
  padding: 12px;
  gap: 12px;
  align-items: center;
`

const NoteText = styled.span`
  font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
  color: ${props => (props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textColor)};
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.isContrastTheme && props.theme.colors.backgroundColor};
`

type NoteProps = {
  text: string
}

const Note = ({ text }: NoteProps): ReactElement => (
  <NoteContainer>
    <StyledIcon src={NoteIcon} />
    <NoteText>{text}</NoteText>
  </NoteContainer>
)

export default Note
