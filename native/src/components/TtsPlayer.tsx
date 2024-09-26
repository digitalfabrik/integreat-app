import { useNavigation } from '@react-navigation/native'
import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from 'react-native'
import Tts from 'react-native-tts'
import styled from 'styled-components/native'

import { CloseIcon, NoSoundIcon, PauseIcon, PlaybackIcon, PlayIcon, SoundIcon } from '../assets'
import { contentAlignmentRTLText } from '../constants/contentDirection'
import { AppContext } from '../contexts/AppContextProvider'
import { extractSentencesFromHtml } from '../utils/TtsPlayerUtils'
import Slider from './Slider'
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
  background-color: #dedede;
  border-radius: 28px;
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: center;
  z-index: 5;
  gap: 5px;
  padding: 6px;
  position: absolute;
  bottom: 5px;
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
const CloseButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-color: ${props => props.theme.colors.themeColor};

  padding: 5px;
  gap: 5px;
  width: 40%;
`

type TtsPlayerProps = {
  disabled?: boolean
  isTtsHtml: boolean
  content: string
  modalVisible?: boolean
  closeModal?: () => void
}

const TtsPlayer = ({
  content,
  modalVisible,
  closeModal,
  disabled = false,
  isTtsHtml = false,
}: TtsPlayerProps): ReactElement => {
  const { languageCode } = useContext(AppContext)
  const { i18n } = useTranslation()
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const navigation = useNavigation()
  const [isPlaying, setIsPlaying] = useState(false)
  const defaultVolume = 50
  const [volume, setVolume] = useState(defaultVolume)
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
        Tts.stop()
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
      const percentage = 100
      Tts.speak(String(sentences[sentenceIndex]), {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: volume / percentage,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
        iosVoiceId: '',
        rate: 1,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isTtsHtml, languageCode, sentenceIndex, sentences])

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (isPlaying) {
        Tts.stop()
        setIsPlaying(false)
      }
    })

    return unsubscribe
  }, [navigation, isPlaying])

  const startReading = () => {
    setIsPlaying(true) // this will start reading sentences
    if (!isTtsHtml) {
      // if text it will run here
      if (contentAlignmentRTLText(typeof content === 'string' ? content : '') === 'left') {
        Tts.setDefaultLanguage(languageCode)
      } else {
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

  const handleBackward = () => {
    Tts.stop()
    setSentenceIndex(prev => Math.max(0, prev - 1)) // it return the bigger number so no minus
    startReading()
  }

  const handleForward = () => {
    Tts.stop()
    setSentenceIndex(prev => Math.min(sentences.length - 1, prev + 1))
    startReading()
  }

  const handleVolumeChange = (newVolume: number) => {
    Tts.stop()
    setVolume(newVolume)
    if (isPlaying) {
      startReading()
    }
  }

  return (
    <>
      {isTtsHtml ? (
        <Modal visible={modalVisible} onRequestClose={closeModal} animationType='slide' transparent>
          <StyledTtsPlayer>
            <StyledPanel>
              <StyledBackForthButton accessibilityLabel='backward Button' onPress={handleBackward}>
                <StyledText>Back</StyledText>
                <BackForthIcon $flip Icon={PlaybackIcon} />
              </StyledBackForthButton>
              <StyledPlayIcon
                accessibilityLabel='Play Button'
                onPress={isPlaying ? pauseReading : startReading}
                icon={<PlayButtonIcon Icon={isPlaying ? PauseIcon : PlayIcon} />}
              />
              <StyledBackForthButton accessibilityLabel='Forward Button' onPress={handleForward}>
                <BackForthIcon $flip={false} Icon={PlaybackIcon} />
                <StyledText>Next</StyledText>
              </StyledBackForthButton>
            </StyledPanel>
            <StyledPanel style={{ paddingHorizontal: 10 }}>
              <Icon Icon={NoSoundIcon} style={{ height: 18, width: 18 }} />
              <Slider maxValue={100} minValue={0} initialValue={50} onValueChange={handleVolumeChange} />
              <Icon Icon={SoundIcon} />
            </StyledPanel>
            <CloseButton
              accessibilityLabel='Close player'
              onPress={closeModal}
              style={{
                elevation: 5, // For Android shadow
                shadowColor: 'black', // For iOS shadow
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
              <Icon Icon={CloseIcon} />
              <StyledText>Close</StyledText>
            </CloseButton>
          </StyledTtsPlayer>
        </Modal>
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
