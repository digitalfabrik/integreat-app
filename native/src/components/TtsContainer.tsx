import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState, Platform } from 'react-native'
import Tts from 'react-native-tts'

import { truncate } from 'shared/utils/getExcerpt'

import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import { reportError } from '../utils/sentry'
import TtsPlayer from './TtsPlayer'

const MAX_TITLE_DISPLAY_CHARS = 20

export type TtsContextType = {
  enabled?: boolean
  canRead: boolean
  visible: boolean
  setVisible: (visible: boolean) => void
  sentences: string[] | null
  setSentences: (sentences: string[]) => void
}

export const TtsContext = createContext<TtsContextType>({
  enabled: false,
  canRead: false,
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
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [sentences, setSentences] = useState<string[]>([])
  const title = sentences[0] || t('nothingToRead')
  const longTitle = truncate(title, { maxChars: MAX_TITLE_DISPLAY_CHARS })
  const unsupportedLanguagesForTts = ['fa', 'ka', 'kmr']
  const [suppressFinishEvent, setSuppressFinishEvent] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const initializeTts = useCallback((): void => {
    Tts.getInitStatus().catch(async error => {
      reportError(`Tts-Error: ${error.code}`)
      if (error.code === 'no_engine') {
        await Tts.requestInstallEngine().catch((e: string) => reportError(`Failed to install tts engine: : ${e}`))
      }
    })
  }, [])

  /** Since ios wrongly triggers internally the tts-finish event even on stop() that should trigger 'tts-cancel' we have to suppress it, because it would trigger the playNext function
   * https://github.com/ak1394/react-native-tts/issues/198
   */
  const suppressFinishEventOnIos = () => {
    if (Platform.OS === 'ios') {
      setSuppressFinishEvent(true)
    }
  }

  const enabled = buildConfig().featureFlags.tts && !unsupportedLanguagesForTts.includes(languageCode)
  const canRead = enabled && sentences.length > 0 // to check if content is available

  const play = useCallback(
    (index = sentenceIndex, automaticSource = true) => {
      const isAndroidOrNotAutoPlay = !automaticSource || Platform.OS === 'android'

      if (suppressFinishEvent) {
        setSuppressFinishEvent(false)
      }
      if (isPaused) {
        Tts.resume().then(() => setIsPaused(false))
      }
      if (isAndroidOrNotAutoPlay) {
        Tts.stop()
      }

      const sentence = sentences[index]
      if (sentence) {
        Tts.setDefaultLanguage(languageCode)
        Tts.speak(sentence, {
          androidParams: {
            KEY_PARAM_PAN: 0,
            KEY_PARAM_VOLUME: 0.6,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
          iosVoiceId: '',
          rate: 0.45,
        })
        setIsPlaying(true)
      }
    },
    [isPaused, languageCode, sentenceIndex, sentences, suppressFinishEvent],
  )

  const stop = useCallback(async () => {
    await Tts.stop()
    suppressFinishEventOnIos()
    setIsPlaying(false)
    setSentenceIndex(0)
  }, [])

  /** The stop function on ios triggers the wrong event ('tts-finish' instead of 'tts-cancel')
   * 'tts-finish' triggers the next sentence, so we use pause which is only available on ios
   */
  const pause = async () => {
    if (Platform.OS === 'ios') {
      Tts.pause().then(() => setIsPaused(true))
    } else {
      Tts.stop()
    }
    setIsPlaying(false)
  }

  const playNextAutomatic = useCallback(() => {
    const nextIndex = sentenceIndex + 1
    if (nextIndex < sentences.length) {
      setSentenceIndex(nextIndex)
      play(nextIndex)
    } else {
      stop().then()
    }
  }, [play, sentenceIndex, sentences.length, stop])

  const playNext = useCallback(() => {
    const nextIndex = sentenceIndex + 1
    if (nextIndex < sentences.length) {
      // do not update index  because ios immediately triggers playNextAuto due to `tts-finish` event, so it will be updated there
      if (Platform.OS === 'ios') {
        play(sentenceIndex, false)
      } else {
        setSentenceIndex(nextIndex)
        play(nextIndex, false)
      }
    } else {
      stop().then()
    }
  }, [play, sentenceIndex, sentences.length, stop])

  const playPrevious = () => {
    // Since ios immediately triggers 'tts-finish' which updates the index, we have to reduce by 2.
    const correctIndex = Platform.OS === 'ios' ? 2 : 1
    const previousIndex = Math.max(0, sentenceIndex - correctIndex)
    setSentenceIndex(previousIndex)
    play(previousIndex, false)
  }

  useEffect(() => {
    if (!enabled) {
      return () => undefined
    }

    initializeTts()
    return () => undefined
  }, [enabled, initializeTts])

  useEffect(() => {
    Tts.addEventListener('tts-finish', () => {
      if (!suppressFinishEvent) {
        playNextAutomatic()
      }
    })

    return () => Tts.removeAllListeners('tts-finish')
  }, [playNextAutomatic, suppressFinishEvent])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        stop().then()
      }
    })

    return subscription.remove
  }, [stop])

  const close = async () => {
    setVisible(false)
    stop()
  }

  const updateSentences = useCallback(
    (newSentences: string[]) => {
      setSentences(newSentences)
      stop().then()
    },
    [stop],
  )

  const ttsContextValue = useMemo(
    () => ({
      enabled,
      canRead,
      visible,
      setVisible,
      sentences,
      setSentences: updateSentences,
    }),
    [enabled, canRead, visible, sentences, updateSentences],
  )

  return (
    <TtsContext.Provider value={ttsContextValue}>
      {children}
      {visible && (
        <TtsPlayer
          isPlaying={isPlaying}
          sentences={sentences}
          playPrevious={playPrevious}
          playNext={playNext}
          close={close}
          pause={pause}
          play={play}
          title={longTitle}
        />
      )}
    </TtsContext.Provider>
  )
}

export default TtsContainer
