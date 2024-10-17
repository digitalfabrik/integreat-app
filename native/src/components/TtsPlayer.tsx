import { debounce } from 'lodash'
import React, { createContext, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState } from 'react-native'
import Tts from 'react-native-tts'
import styled from 'styled-components/native'

import { CloseIcon, NoSoundIcon, PauseIcon, PlaybackIcon, PlayIcon, SoundIcon } from '../assets'
import { isRTL } from '../constants/contentDirection'
import { AppContext } from '../contexts/AppContextProvider'
import { extractSentencesFromHtml } from '../utils/TtsPlayerUtils'
import { reportError } from '../utils/sentry'
import Slider from './Slider'
import Icon from './base/Icon'
import IconButton from './base/IconButton'
import Text from './base/Text'

const StyledTtsPlayer = styled.View<{ $isPlaying: boolean }>`
  background-color: ${props => props.theme.colors.grayBackgroundColor};
  border-radius: 28px;
  width: 85%;
  display: flex;
  flex-direction: ${props => (props.$isPlaying ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  align-self: center;
  padding: 6px;
  position: absolute;
  bottom: 5px;
  min-height: 93px;
  gap: ${props => (props.$isPlaying ? '5px;' : '10px')};
`

const StyledPanel = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`

const StyledPlayIcon = styled(IconButton)`
  background-color: ${props => props.theme.colors.textColor};
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
  color: ${props => props.theme.colors.grayBackgroundColor};
`

const StyledNoSoundIcon = styled(Icon)`
  height: 18px;
  width: 18px;
`

const FlipView = styled.View`
  transform: scaleX(-1);
`

const StyledText = styled(Text)`
  font-weight: bold;
`

const StyledPlayerHeaderText = styled(Text)`
  font-weight: 600;
  align-self: center;
  font-size: 18px;
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
  width: 176px;
`

const CloseView = styled.View`
  flex-direction: column;
  gap: 10px;
`

const elevatedButton = {
  elevation: 5, // For Android shadow
  shadowColor: 'black', // For iOS shadow
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
}

export type TtsContextType = {
  content: string | null
  setContent: React.Dispatch<React.SetStateAction<string | null>>
  sentenceIndex: number
  setSentenceIndex: React.Dispatch<React.SetStateAction<number>>
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  volume: number
  setVolume: React.Dispatch<React.SetStateAction<number>>
}

export const ttsContext = createContext<TtsContextType>({
  content: null,
  setContent: () => undefined,
  sentenceIndex: 0,
  setSentenceIndex: () => undefined,
  visible: false,
  setVisible: () => undefined,
  title: '',
  setTitle: () => undefined,
  volume: 50,
  setVolume: () => undefined,
})

type TtsPlayerProps = {
  children: ReactElement
  initialVisibility?: boolean
}

const TtsPlayer = ({ initialVisibility = false, children }: TtsPlayerProps): ReactElement => {
  const { languageCode } = useContext(AppContext)
  const { t } = useTranslation('layout')
  const [isPlaying, setIsPlaying] = useState(false)
  const [expandPlayer, setExpandPlayer] = useState(false)
  const defaultVolume = 50
  const [volume, setVolume] = useState(defaultVolume)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [content, setContent] = useState<string | null>(null)
  const [visible, setVisible] = useState(initialVisibility)
  const [title, setTitle] = useState('')
  const sentences: string[] | [] = useMemo(
    () => (content ? [title, ...extractSentencesFromHtml(content, languageCode)] : []),
    [content, title, languageCode],
  )
  const isPersian = languageCode === 'fa'
  const maxTitle = 20
  const isTitleLong = title.length > maxTitle ? title.substring(0, maxTitle).concat('...') : title || t('readAloud')

  const initializeTts = useCallback((): void => {
    Tts.getInitStatus().catch(async error => {
      reportError(`Tts-Error: ${error.code}`)
      if (error.code === 'no_engine') {
        await Tts.requestInstallEngine().catch((e: string) => reportError(`Failed to install tts engine: : ${e}`))
      }
    })
  }, [])

  useEffect(() => {
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
  }, [initializeTts, sentenceIndex, sentences.length])

  useEffect(() => {
    if (isPlaying && sentences.length > 0) {
      Tts.setDefaultLanguage(languageCode)
      const percentage = 100
      Tts.speak(String(sentences[sentenceIndex]), {
        androidParams: {
          KEY_PARAM_PAN: 0,
          KEY_PARAM_VOLUME: volume / percentage,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
        iosVoiceId: '',
        rate: 1,
      })
    }
    if (sentences.length === 0) {
      // if there is no sentences (null) just reset for future use
      setSentenceIndex(0)
      setExpandPlayer(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, languageCode, sentenceIndex, sentences])

  useEffect(() => {
    // Stop tts if not in foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        Tts.stop()
      }
    })

    return () => {
      subscription.remove()
    }
  }, [])

  const stopTts = async () => {
    await Tts.stop()
    const TTS_STOP_DELAY = 100 // delay to make sure tts is stopped
    await new Promise(resolve => {
      setTimeout(resolve, TTS_STOP_DELAY)
    })
  }
  const startReading = () => {
    if (!isPersian && sentences.length > 0) {
      // Persian not supported
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  const pauseReading = () => {
    Tts.stop()
    setIsPlaying(false)
  }

  const handleBackward = async () => {
    await stopTts()
    setSentenceIndex(prev => Math.max(0, prev - 1)) // it return the bigger number so no negative values
    startReading()
  }

  const handleForward = async () => {
    await stopTts()
    setSentenceIndex(prev => Math.min(sentences.length - 1, prev + 1))
    startReading()
  }

  const debounceDelay = 500

  const debouncedVolumeChange = debounce((newVolume: number) => {
    setVolume(newVolume)
    if (isPlaying) {
      Tts.stop().then(() =>
        setTimeout(() => {
          startReading()
          // eslint-disable-next-line no-magic-numbers
        }, 200),
      )
    }
  }, debounceDelay)

  const handleVolumeChange = (newVolume: number) => {
    debouncedVolumeChange(newVolume)
  }

  const handleClose = async () => {
    setVisible(false)
    setExpandPlayer(false)
    await stopTts()
  }

  const ttsContextValue = useMemo(
    () => ({
      content,
      setContent,
      sentenceIndex,
      setSentenceIndex,
      visible,
      setVisible,
      title,
      setTitle,
      volume,
      setVolume,
    }),
    [content, sentenceIndex, visible, title, volume],
  )
  return (
    <ttsContext.Provider value={ttsContextValue}>
      {children}
      {visible && (
        <StyledTtsPlayer $isPlaying={expandPlayer} style={elevatedButton}>
          <StyledPanel>
            {expandPlayer && (
              <StyledBackForthButton accessibilityLabel='backward Button' onPress={handleBackward}>
                <StyledText>{t('prev')}</StyledText>
                <FlipView>
                  <Icon Icon={PlaybackIcon} />
                </FlipView>
              </StyledBackForthButton>
            )}
            <StyledPlayIcon
              style={elevatedButton}
              accessibilityLabel='Play Button'
              onPress={() => {
                if (isPlaying) {
                  pauseReading()
                } else {
                  startReading()
                }
                setExpandPlayer(!isPlaying)
              }}
              icon={<PlayButtonIcon Icon={isPlaying ? PauseIcon : PlayIcon} />}
            />
            {expandPlayer && (
              <StyledBackForthButton accessibilityLabel='Forward Button' onPress={handleForward}>
                <Icon Icon={PlaybackIcon} />
                <StyledText>{t('next')}</StyledText>
              </StyledBackForthButton>
            )}
          </StyledPanel>
          {expandPlayer && (
            <StyledPanel style={{ paddingHorizontal: 10, flexDirection: isRTL() ? 'row-reverse' : 'row' }}>
              <StyledNoSoundIcon Icon={NoSoundIcon} />
              <Slider maxValue={100} minValue={0} initialValue={volume} onValueChange={handleVolumeChange} />
              <Icon Icon={SoundIcon} />
            </StyledPanel>
          )}
          <CloseView>
            {!expandPlayer && <StyledPlayerHeaderText>{isTitleLong}</StyledPlayerHeaderText>}
            <CloseButton accessibilityLabel='Close player' onPress={handleClose} style={elevatedButton}>
              <Icon Icon={CloseIcon} />
              <StyledText>{t('common:close')}</StyledText>
            </CloseButton>
          </CloseView>
        </StyledTtsPlayer>
      )}
    </ttsContext.Provider>
  )
}

export default TtsPlayer
