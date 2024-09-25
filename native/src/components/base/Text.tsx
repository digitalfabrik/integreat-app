import React, { ReactElement } from 'react'
import { TextProps, Text as RNText } from 'react-native'
import styled from 'styled-components/native'

import { contentAlignmentRTLText } from '../../constants/contentDirection'

const StyledText = styled(RNText)<{ alignment: 'left' | 'right' }>`
  text-align: ${props => props.alignment};
`
/** Direction aware text component */
const Text = (props: TextProps): ReactElement => {
  const { children, style } = props
  return (
    <StyledText
      alignment={contentAlignmentRTLText(typeof children === 'string' ? children : '')}
      style={style}
      android_hyphenationFrequency='full'
      {...props}>
      {children}
    </StyledText>
  )
}

export default Text
