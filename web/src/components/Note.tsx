import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { NoteIcon } from '../assets'
import Icon from './base/Icon'

const NoteContainer = styled.div<{ visible: boolean }>`
  display: flex;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 12px;
  gap: 12px;
  align-items: center;
  visibility: ${props => !props.visible && 'hidden'};
`

const NoteText = styled.span`
  font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
`

type NoteProps = {
  text: string
  visible: boolean
}

const Note = ({ text, visible }: NoteProps): ReactElement => (
  <NoteContainer visible={visible}>
    <Icon src={NoteIcon} />
    <NoteText>{text}</NoteText>
  </NoteContainer>
)

export default Note
