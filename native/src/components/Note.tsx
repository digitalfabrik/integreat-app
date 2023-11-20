import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { NoteIcon } from '../assets'
import Icon from './base/Icon'

const NoteBox = styled.View<{ visible: boolean }>`
  background-color: ${props => props.theme.colors.themeColor};
  margin-top: 12px;
  padding: 12px;
  flex-direction: row;
  visibility: ${props => !props.visible && 'hidden'};
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
`

type NoteProps = {
  text: string
  visible: boolean
}

const Note = ({ text, visible }: NoteProps): ReactElement => (
  <NoteBox visible={visible}>
    <StyledIcon Icon={NoteIcon} />
    <NoteText>{text}</NoteText>
  </NoteBox>
)

export default Note
