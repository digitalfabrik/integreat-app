import React, { ReactElement, useEffect, useState } from 'react'
import { TextProps, Text as RNText } from 'react-native'
import Tts, { TtsEventHandler } from 'react-native-tts'
import styled from 'styled-components/native'

import { PauseIcon, SoundIcon } from '../../assets'
import { contentAlignmentRTLText } from '../../constants/contentDirection'
import Icon from './Icon'
import IconButton from './IconButton'

const StyledText = styled(RNText)<{ alignment: 'left' | 'right' }>`
  text-align: ${props => props.alignment};
`
const StyledIcon = styled(IconButton)`
  position: absolute;
  left: 10px;
  top: 15px;
  z-index: 20;
  width: 30px;
  height: 30px;
  background-color: transparent;
  /* border-radius: 5px;
  border: 0.5px solid rgba(0, 0, 0, 0.3); */
`
type TtsOptions = {
  enableTts?: boolean // Prop to enable or disable TTS
}
/** Direction aware text component */
const Text = (props: TextProps & TtsOptions): ReactElement => {
  const { children, style, enableTts = false } = props
  const text = typeof children === 'string' ? children : ''
  const [isPlaying, setIsPlaying] = useState(false)
  const [sentences, setSentences] = useState<string[]>([])
  const [currentSentence, setCurrentSentence] = useState<number>(0)

  // const initializeTtsListeners = async () => {
  //   // Check the initialization status of the TTS engine
  //   Tts.getInitStatus().then(
  //     e => {
  //       console.log('ALL OK TTS ✅') // TTS is initialized successfully
  //     },
  //     err => {
  //       // If there is no TTS engine installed, request to install one
  //       if (err.code === 'no_engine') {
  //         console.log('NO ENGINE TTS ✅')
  //         Tts.requestInstallEngine()
  //       }
  //     },
  //   )
  // }

  useEffect(() => {
    if (enableTts) {
      const finishedListener: TtsEventHandler<'tts-finish'> = () => {
        if (currentSentence < sentences.length - 1) {
          setCurrentSentence(prev => prev + 1)
        } else {
          setIsPlaying(false)
          setCurrentSentence(0)
        }
      }

      const startListener: TtsEventHandler<'tts-start'> = () => {
        setIsPlaying(true)
      }

      Tts.addEventListener('tts-start', startListener)
      Tts.addEventListener('tts-finish', finishedListener)
    }
    return () => {
      Tts.removeAllListeners('tts-start')
      Tts.removeAllListeners('tts-finish')
    }
  }, [currentSentence, enableTts, sentences.length])

  useEffect(() => {
    if (enableTts) {
      const splitSentences = text.split(' ')
      setSentences(splitSentences)
    }
  }, [enableTts, text])

  useEffect(() => {
    if (isPlaying) {
      Tts.speak(sentences[currentSentence])
    }
  }, [currentSentence, isPlaying, sentences])

  const pauseReading = () => {
    Tts.stop()
    setIsPlaying(false)
  }

  return (
    <>
      <StyledText
        alignment={contentAlignmentRTLText(typeof children === 'string' ? children : '')}
        style={style}
        android_hyphenationFrequency='full'
        {...props}>
        {children}
      </StyledText>
      {enableTts && (
        <StyledIcon
          accessibilityLabel='Sound button'
          icon={isPlaying ? <Icon Icon={PauseIcon} /> : <Icon Icon={SoundIcon} />}
          onPress={isPlaying ? pauseReading : () => setIsPlaying(true)}
        />
      )}
    </>
  )
}

export default Text
