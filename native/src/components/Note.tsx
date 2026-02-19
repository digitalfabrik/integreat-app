import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import Icon from './base/Icon'
import Text from './base/Text'

const NoteBox = styled.View`
  margin-top: 12px;
  padding: 12px;
  flex-direction: row;
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
      <StyledIcon color={theme.colors.error} source='alert-circle-outline' />
      <Text
        variant='body3'
        style={{
          fontFamily: theme.legacy.fonts.native.decorativeFontRegular,
          color: theme.colors.error,
          flex: 1,
          flexWrap: 'wrap',
        }}>
        {text}
      </Text>
    </NoteBox>
  )
}

export default Note
