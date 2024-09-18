import { useRoute } from '@react-navigation/native'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TextProps, Text as RNText } from 'react-native'
import Tts from 'react-native-tts'
import styled from 'styled-components/native'

import { PauseIcon, SoundIcon } from '../../assets'
import { contentAlignmentRTLText } from '../../constants/contentDirection'
import { AppContext } from '../../contexts/AppContextProvider'
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
  const { languageCode } = useContext(AppContext)
  const route = useRoute()
  const { i18n } = useTranslation()
  const isPersian = languageCode === 'fa' || i18n.language === 'fa'
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
    // Tts.engines().then(engines => console.log(engines));
    // initializeTtsListeners()
  }, [])

  useEffect(() => {
    if (enableTts && !isPersian) {
      Tts.addEventListener('tts-finish', () => setIsPlaying(false))
      Tts.addEventListener('tts-progress', () => setIsPlaying(true))
      Tts.addEventListener('tts-cancel', () => setIsPlaying(false))
    }
    return () => {
      Tts.removeAllListeners('tts-progress')
      Tts.removeAllListeners('tts-cancel')
    }
  }, [enableTts, isPersian])

  const startReading = () => {
    if (route.name === 'events') {
      if (contentAlignmentRTLText(typeof children === 'string' ? children : '') === 'left') {
        Tts.setDefaultLanguage(languageCode)
      } else {
        Tts.setDefaultLanguage('ar')
      }
    } else if (route.name === 'categories') {
      Tts.setDefaultLanguage(languageCode)
    } else {
      Tts.setDefaultLanguage(i18n.language)
    }
    Tts.speak(text)
    setIsPlaying(true)
  }
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
      {enableTts && !isPersian && (
        <StyledIcon
          accessibilityLabel='Sound button'
          icon={isPlaying ? <Icon Icon={PauseIcon} /> : <Icon Icon={SoundIcon} />}
          onPress={isPlaying ? pauseReading : startReading}
        />
      )}
    </>
  )
}

export default Text
