import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { NoteIcon } from '../assets'
import Icon from './base/Icon'

const NoteBox = styled.View`
  background-color: ${props => props.theme.colors.warningColor};
  margin-top: 12px;
  padding: 12px;
  flex-direction: row;
`

const NoteText = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 12px;
  flex: 1;
  flex-wrap: wrap;
`

const StyledIcon = styled(Icon)`
  align-self: center;
  margin-right: 12px;
  ${props => props.theme.isContrastTheme && `color: ${props.theme.colors.backgroundColor}`}
`

type NoteProps = {
  text: string
}

const Note = ({ text }: NoteProps): ReactElement => (
  <NoteBox>
    <StyledIcon Icon={NoteIcon} />
    <NoteText>{text}</NoteText>
  </NoteBox>
)

export default Note
