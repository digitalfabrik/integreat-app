import React, { ReactElement } from 'react'
import { TextProps, Text as RNText } from 'react-native'
import styled from 'styled-components/native'

import { contentAlignmentRTLText } from '../../constants/contentDirection'
import TtsPlayer from '../TtsPlayer'

const StyledText = styled(RNText)<{ alignment: 'left' | 'right' }>`
  text-align: ${props => props.alignment};
`

type TtsOptions = {
  enableTts?: boolean // Prop to enable or disable TTS
}
/** Direction aware text component */
const Text = (props: TextProps & TtsOptions): ReactElement => {
  const { children, style, enableTts } = props
  return (
    <>
      <StyledText
        alignment={contentAlignmentRTLText(typeof children === 'string' ? children : '')}
        style={style}
        android_hyphenationFrequency='full'
        {...props}>
        {children}
      </StyledText>
      {enableTts && <TtsPlayer isTtsHtml={false} content={String(children)} />}
    </>
  )
}

export default Text
