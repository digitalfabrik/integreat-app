import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState } from 'react-native'
import Tts from 'react-native-tts'

import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import { reportError } from '../utils/sentry'
import TtsPlayer from './TtsPlayer'

const unsupportedLanguagesForTts = ['fa']

export const isTtsActive = (content: string[] | null, languageCode: string): boolean =>
  Array.isArray(content) &&
  content.length > 0 &&
  buildConfig().featureFlags.tts &&
  !unsupportedLanguagesForTts.includes(languageCode)

export type TtsContextType = {
  visible: boolean
  setVisible: (visible: boolean) => void
  sentences: string[] | null
  setSentences: (sentences: string[]) => void
}

export const ttsContext = createContext<TtsContextType>({
  visible: false,
  setVisible: () => undefined,
  sentences: [],
  setSentences: () => undefined,
})

type TtsContainerProps = {
  children: ReactElement
}

const TtsContainer = ({ children }: TtsContainerProps): ReactElement => {
  const { languageCode } = React.useContext(AppContext)
  const { t } = useTranslation('layout')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [sentences, setSentences] = useState<string[]>([])

  const unsupportedLanguage = unsupportedLanguagesForTts.includes(languageCode)
  const maxTitle = 20
  const title = sentences[0] || t('readAloud')
  const longTitle = title.length > maxTitle ? title.substring(0, maxTitle).concat('...') : title

  const callOnEnd = () => {
    Tts.stop()
    setIsPlaying(false)
    setIsExpanded(false)
    setSentenceIndex(0)
  }

  const initializeTts = useCallback((): void => {
    Tts.getInitStatus().catch(async error => {
      reportError(`Tts-Error: ${error.code}`)
      if (error.code === 'no_engine') {
        await Tts.requestInstallEngine().catch((e: string) => reportError(`Failed to install tts engine: : ${e}`))
      }
    })
  }, [])

  const startReading = (index = sentenceIndex) => {
    if (!unsupportedLanguage && sentences.length > 0) {
      // Persian not supported
      Tts.setDefaultLanguage(languageCode)
      Tts.speak(String(sentences[index]), {
        androidParams: {
          KEY_PARAM_PAN: 0,
          KEY_PARAM_VOLUME: 0.6,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
        iosVoiceId: '',
        rate: 1,
      })
      if (sentences.length === 0) {
        setSentenceIndex(0)
        setIsExpanded(false)
      }
    } else {
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    initializeTts()

    Tts.addEventListener('tts-progress', () => setIsPlaying(true))
    Tts.addEventListener('tts-cancel', () => setIsPlaying(false))
    Tts.addEventListener('tts-finish', () => {
      if (sentenceIndex < sentences.length - 1) {
        const nextIndex = sentenceIndex + 1
        setSentenceIndex(nextIndex)
        startReading(nextIndex)
      } else {
        callOnEnd()
      }
    })

    return () => {
      Tts.removeAllListeners('tts-finish')
      Tts.removeAllListeners('tts-progress')
      Tts.removeAllListeners('tts-cancel')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializeTts, sentenceIndex, sentences.length])

  useEffect(() => {
    if (sentences.length <= 1) {
      callOnEnd()
    }
  }, [sentences])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        callOnEnd()
      }
    })

    return subscription.remove
  }, [])

  const stopTts = async () => {
    await Tts.stop()
    const TTS_STOP_DELAY = 100
    await new Promise(resolve => {
      setTimeout(resolve, TTS_STOP_DELAY)
    })
  }

  const pauseReading = () => {
    Tts.stop()
    setIsPlaying(false)
  }

  const handleBackward = async () => {
    await stopTts()
    const prevIndex = Math.max(0, sentenceIndex - 1)
    setSentenceIndex(prevIndex)
    startReading(prevIndex)
  }

  const handleForward = async () => {
    await stopTts()
    const nextIndex = Math.min(sentences.length - 1, sentenceIndex + 1)
    setSentenceIndex(nextIndex)
    startReading(nextIndex)
  }

  const handleClose = async () => {
    setVisible(false)
    setIsExpanded(false)
    await stopTts()
  }

  const ttsContextValue = useMemo(
    () => ({
      sentenceIndex,
      setSentenceIndex,
      visible,
      setVisible,
      sentences,
      setSentences,
      languageCode,
    }),
    [sentenceIndex, visible, sentences, languageCode],
  )

  return (
    <ttsContext.Provider value={ttsContextValue}>
      {children}
      {visible && (
        <TtsPlayer
          isExpanded={isExpanded}
          isPlaying={isPlaying}
          setIsExpanded={setIsExpanded}
          handleBackward={handleBackward}
          handleForward={handleForward}
          handleClose={handleClose}
          pauseReading={pauseReading}
          startReading={startReading}
          title={longTitle}
        />
      )}
    </ttsContext.Provider>
  )
}

export default TtsContainer
