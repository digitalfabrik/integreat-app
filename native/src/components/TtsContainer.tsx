import { debounce } from 'lodash'
import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState } from 'react-native'
import Tts from 'react-native-tts'

import { AppContext } from '../contexts/AppContextProvider'
import { reportError } from '../utils/sentry'
import TtsPlayer from './TtsPlayer'

export type TtsContextType = {
  sentenceIndex: number
  setSentenceIndex: React.Dispatch<React.SetStateAction<number>>
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  volume: number
  setVolume: React.Dispatch<React.SetStateAction<number>>
  sentences: string[] | null
  setSentences: React.Dispatch<React.SetStateAction<string[]>>
  languageCode: string
}

export const ttsContext = createContext<TtsContextType>({
  sentenceIndex: 0,
  setSentenceIndex: () => undefined,
  visible: false,
  setVisible: () => undefined,
  title: '',
  setTitle: () => undefined,
  volume: 50,
  setVolume: () => undefined,
  sentences: [],
  setSentences: () => undefined,
  languageCode: '',
})

type TtsContainerProps = {
  children: ReactElement
  initialVisibility?: boolean
}

const TtsContainer = ({ initialVisibility = false, children }: TtsContainerProps): ReactElement => {
  const { languageCode } = React.useContext(AppContext)
  const { t } = useTranslation('layout')
  const [isPlaying, setIsPlaying] = useState(false)
  const [expandPlayer, setExpandPlayer] = useState(false)
  const defaultVolume = 50
  const [volume, setVolume] = useState(defaultVolume)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [visible, setVisible] = useState(initialVisibility)
  const [title, setTitle] = useState('')
  const [sentences, setSentences] = useState<string[]>([])

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
        setSentenceIndex(index => index + 1)
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
      setSentenceIndex(0)
      setExpandPlayer(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, languageCode, sentenceIndex, sentences])

  useEffect(() => {
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
    setSentenceIndex(index => Math.max(0, index - 1))
    startReading()
  }

  const handleForward = async () => {
    await stopTts()
    setSentenceIndex(index => Math.min(sentences.length - 1, index + 1))
    startReading()
  }

  const debounceDelay = 500
  const debounceSetTimeoutDelay = 200

  const debouncedVolumeChange = debounce((newVolume: number) => {
    setVolume(newVolume)
    if (isPlaying) {
      Tts.stop().then(() =>
        setTimeout(() => {
          startReading()
        }, debounceSetTimeoutDelay),
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
      sentenceIndex,
      setSentenceIndex,
      visible,
      setVisible,
      title,
      setTitle,
      volume,
      setVolume,
      sentences,
      setSentences,
      languageCode,
    }),
    [sentenceIndex, visible, title, volume, sentences, languageCode],
  )

  return (
    <ttsContext.Provider value={ttsContextValue}>
      {children}
      {visible && (
        <TtsPlayer
          expandPlayer={expandPlayer}
          isPlaying={isPlaying}
          setExpandPlayer={setExpandPlayer}
          handleBackward={handleBackward}
          handleForward={handleForward}
          handleVolumeChange={handleVolumeChange}
          handleClose={handleClose}
          pauseReading={pauseReading}
          startReading={startReading}
          isTitleLong={isTitleLong}
        />
      )}
    </ttsContext.Provider>
  )
}

export default TtsContainer
