import { useNavigation } from '@react-navigation/native'
import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Tts from 'react-native-tts'
import styled from 'styled-components/native'

import { PauseIcon, PlaybackIcon, PlayIcon, SoundIcon } from '../assets'
import { contentAlignmentRTLText } from '../constants/contentDirection'
import { AppContext } from '../contexts/AppContextProvider'
import Slider from './Slider'
// import Slider from './Slider'
import Icon from './base/Icon'
import IconButton from './base/IconButton'
import Text from './base/Text'

const StyledIcon = styled(IconButton)`
  position: absolute;
  left: 10px;
  top: 15px;
  z-index: 20;
  width: 30px;
  height: 30px;
  background-color: transparent;
`

const StyledTtsPlayer = styled.View`
  position: absolute;
  bottom: 10px;
  background-color: #dedede;
  border-radius: 28px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: center;
  z-index: 5;
  gap: 5px;
`
const StyledPanel = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`
const StyledPlayIcon = styled(IconButton)`
  background-color: #232323;
  width: 50px;
  height: 50px;
  border-radius: 50px;
`
const StyledBackForthButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: flex-end;
`

const PlayButtonIcon = styled(Icon)`
  color: #dedede;
`
const SmallPlayIcon = styled(Icon)`
  color: ${props => props.theme.colors.themeColor};
`
const BackForthIcon = styled(Icon)<{ $flip: boolean }>`
  transform: ${props => (props.$flip ? 'scaleX(-1)' : '')};
`
const StyledText = styled(Text)`
  font-weight: bold;
`

type TtsPlayerProps = {
  disabled?: boolean
  isTtsHtml: boolean
  content: string
}

const decodeHtmlEntities = (html: string): string =>
  html
    // Handle decimal entities like &#1610;
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    // Handle hexadecimal entities like &#x1F600;
    .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Handle named entities like &quot;, &amp;
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'") // Apostrophe

const extractSentencesFromHtml = (html: string) => {
  const decodedText = decodeHtmlEntities(html)
  const cleanText = decodedText.replace(/<\/?[^>]+(>|$)/g, '')
  const sentences = cleanText.split('.').map(sentence => sentence.trim())
  return sentences.filter(sentence => sentence.length > 0)
}

const TtsPlayer = ({ content, disabled = false, isTtsHtml = false }: TtsPlayerProps): ReactElement => {
  const { languageCode } = useContext(AppContext)
  const { i18n } = useTranslation()
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const navigation = useNavigation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
  const sentences = useMemo(() => extractSentencesFromHtml(content), [content])
  const isPersian = languageCode === 'fa' || i18n.language === 'fa'
  const initializeTts = useCallback((): void => {
    Tts.getInitStatus()
      .then(async (status: string) => {
        // Status does not have to be 'success'
        if (status === 'success') {
          // await Tts.setDefaultLanguage('de-DE')
        }
      })
      .catch(async error => {
        /* eslint-disable-next-line no-console */
        console.error(`Tts-Error: ${error.code}`)
        if (error.code === 'no_engine') {
          /* eslint-disable-next-line no-console */
          await Tts.requestInstallEngine().catch((e: string) => console.error('Failed to install tts engine: ', e))
        }
      })
  }, [])

  useEffect(() => {
    if (disabled) {
      return () => undefined
    }
    initializeTts()

    Tts.addEventListener('tts-progress', () => setIsPlaying(true))
    Tts.addEventListener('tts-cancel', () => setIsPlaying(false))
    Tts.addEventListener('tts-finish', () => {
      if (sentenceIndex < sentences.length - 1) {
        setSentenceIndex(prev => prev + 1)
      } else {
        setIsPlaying(false)
        setSentenceIndex(0)
      }
    })

    return () => {
      Tts.removeAllListeners('tts-finish')
      Tts.removeAllListeners('tts-progress')
      Tts.removeAllListeners('tts-cancel')
    }
  }, [disabled, initializeTts, sentenceIndex, sentences.length])

  useEffect(() => {
    if (isPlaying && isTtsHtml) {
      setIsPlaying(true)
      Tts.setDefaultLanguage(languageCode)
      Tts.speak(String(sentences[sentenceIndex]))
    }
  }, [isPlaying, isTtsHtml, languageCode, sentenceIndex, sentences])

  useEffect(() => {
    // stop tts when heading back
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (isPlaying) {
        Tts.stop()
        setIsPlaying(false)
      }
    })

    return unsubscribe
  }, [navigation, isPlaying])

  const startReading = () => {
    setIsPlaying(true)
    if (!isTtsHtml) {
      if (contentAlignmentRTLText(typeof content === 'string' ? content : '') === 'left') {
        Tts.setDefaultLanguage(languageCode)
      } else {
        // if persian is not supported then leaves the arabic the only rtl language
        Tts.setDefaultLanguage('ar')
      }
      setIsPlaying(true)
      Tts.speak(content)
    }
  }
  const pauseReading = () => {
    Tts.stop()
    setIsPlaying(false)
  }

  return (
    <>
      {isTtsHtml ? (
        <StyledTtsPlayer>
          <StyledPanel>
            <StyledBackForthButton accessibilityLabel='Forward Button' onPress={() => {}}>
              <StyledText>10</StyledText>
              <BackForthIcon $flip Icon={PlaybackIcon} />
            </StyledBackForthButton>
            <StyledPlayIcon
              accessibilityLabel='Play Button'
              onPress={isPlaying ? pauseReading : startReading}
              icon={<PlayButtonIcon Icon={isPlaying ? PauseIcon : PlayIcon} />}
            />
            <StyledBackForthButton accessibilityLabel='Forward Button' onPress={() => {}}>
              <BackForthIcon $flip={false} Icon={PlaybackIcon} />
              <StyledText>10</StyledText>
            </StyledBackForthButton>
          </StyledPanel>
          <StyledPanel>
            <Slider maxValue={100} minValue={0} onValueChange={setVolume} />
          </StyledPanel>
        </StyledTtsPlayer>
      ) : (
        !isPersian && (
          <StyledIcon
            accessibilityLabel='Sound button'
            icon={<SmallPlayIcon Icon={isPlaying ? PauseIcon : SoundIcon} />}
            onPress={isPlaying ? pauseReading : startReading}
          />
        )
      )}
    </>
  )
}

export default TtsPlayer
