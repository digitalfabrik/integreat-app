import { debounce } from 'lodash'
import React, { createContext, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Tts from 'react-native-tts'
import styled from 'styled-components/native'

import { CloseIcon, NoSoundIcon, PauseIcon, PlaybackIcon, PlayIcon, SoundIcon } from '../assets'
import { AppContext } from '../contexts/AppContextProvider'
import { extractSentencesFromHtml } from '../utils/TtsPlayerUtils'
import Slider from './Slider'
import Icon from './base/Icon'
import IconButton from './base/IconButton'
import Text from './base/Text'

const StyledTtsPlayer = styled.View<{ $isPlaying: boolean }>`
  background-color: #dedede;
  border-radius: 28px;
  width: 95%;
  display: flex;
  flex-direction: ${props => (props.$isPlaying ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  align-self: center;
  z-index: 5;
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

const BackForthIcon = styled(Icon)<{ $flip: boolean }>`
  transform: ${props => (props.$flip ? 'scaleX(-1)' : '')};
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

export type ttsContextType = {
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
  sentenceIndex: number
  setSentenceIndex: React.Dispatch<React.SetStateAction<number>>
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export const ttsContext = createContext<ttsContextType>({
  content: '',
  setContent: () => {
    // setContent
  },
  sentenceIndex: 0,
  setSentenceIndex: () => {
    // setSentenceIndex
  },
  visible: false,
  setVisible: () => {
    // setSentenceIndex
  },
})

type TtsPlayerProps = {
  disabled?: boolean
  children: ReactElement
  initialVisibility?: boolean
}
const TtsPlayer = ({ initialVisibility = false, disabled = false, children }: TtsPlayerProps): ReactElement | null => {
  const { languageCode } = useContext(AppContext)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  // const navigation = useNavigation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [expandPlayer, setExpandPlayer] = useState(false)
  const defaultVolume = 50
  const [volume, setVolume] = useState(defaultVolume)
  const [content, setContent] = useState('')
  const [visible, setVisible] = useState(initialVisibility)
  const sentences: string[] = useMemo(() => extractSentencesFromHtml(content), [content])

  const isPersian = languageCode === 'fa'

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
    if (isPlaying) {
      setIsPlaying(true)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, languageCode, sentenceIndex, sentences])

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('beforeRemove', () => {
  //     if (isPlaying) {
  //       Tts.stop()
  //       setIsPlaying(false)
  //     }
  //   })

  //   return unsubscribe
  // }, [navigation, isPlaying])

  const startReading = () => {
    if (!isPersian) {
      // Persian not supported
      setIsPlaying(true) // this will start reading sentences
    }
    // if (!isTtsHtml) {
    //   // if text it will run here
    //   if (contentAlignmentRTLText(typeof content === 'string' ? content : '') === 'left') {
    //     Tts.setDefaultLanguage(languageCode)
    //   } else {
    //     Tts.setDefaultLanguage('ar')
    //   }
    //   setIsPlaying(true)
    //   Tts.speak(content)
    // }
  }

  const pauseReading = () => {
    Tts.stop()
    setIsPlaying(false)
  }

  const handleBackward = () => {
    Tts.stop()
    setSentenceIndex(prev => Math.max(0, prev - 1)) // it return the bigger number so no negative values
    startReading()
  }

  const handleForward = () => {
    Tts.stop()
    setSentenceIndex(prev => Math.min(sentences.length - 1, prev + 1))
    startReading()
  }

  const debouncedVolumeChange = debounce((newVolume: number) => {
    setVolume(newVolume)
    Tts.stop().then(() =>
      setTimeout(() => {
        startReading()
      }, 200),
    )
  }, 500)

  const handleVolumeChange = (newVolume: number) => {
    debouncedVolumeChange(newVolume)
  }

  const ttsContextValue = useMemo(
    () => ({
      content,
      setContent,
      sentenceIndex,
      setSentenceIndex,
      visible,
      setVisible,
    }),
    [content, setContent, sentenceIndex, setSentenceIndex, visible, setVisible],
  )
  return (
    <ttsContext.Provider value={ttsContextValue}>
      {children}
      {visible && (
        <StyledTtsPlayer $isPlaying={expandPlayer}>
          <StyledPanel>
            {expandPlayer && (
              <StyledBackForthButton accessibilityLabel='backward Button' onPress={handleBackward}>
                <StyledText>Back</StyledText>
                <BackForthIcon $flip Icon={PlaybackIcon} />
              </StyledBackForthButton>
            )}
            <StyledPlayIcon
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
                <BackForthIcon $flip={false} Icon={PlaybackIcon} />
                <StyledText>Next</StyledText>
              </StyledBackForthButton>
            )}
          </StyledPanel>
          {expandPlayer && (
            <StyledPanel style={{ paddingHorizontal: 10 }}>
              <Icon Icon={NoSoundIcon} style={{ height: 18, width: 18 }} />
              <Slider maxValue={100} minValue={0} initialValue={50} onValueChange={handleVolumeChange} />
              <Icon Icon={SoundIcon} />
            </StyledPanel>
          )}
          <CloseView>
            {!expandPlayer && <StyledPlayerHeaderText>Vorlesefunktion</StyledPlayerHeaderText>}
            <CloseButton
              accessibilityLabel='Close player'
              onPress={() => setVisible(false)}
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
          </CloseView>
        </StyledTtsPlayer>
      )}
    </ttsContext.Provider>
  )
}

export default TtsPlayer
