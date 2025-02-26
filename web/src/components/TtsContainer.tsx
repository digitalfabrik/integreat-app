import EasySpeech from 'easy-speech'
import React, { createContext, ReactElement, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TTS_MAX_TITLE_DISPLAY_CHARS } from 'shared'
import { truncate } from 'shared/utils/getExcerpt'

import buildConfig from '../constants/buildConfig'
import TtsHelpModal from './TtsHelpModal'
import TtsPlayer from './TtsPlayer'

const userAgent = navigator.userAgent.toLowerCase()
// https://github.com/mdn/browser-compat-data/issues/13191
const isFirefoxLinux = userAgent.includes('firefox') && userAgent.includes('linux')
// https://github.com/leaonline/easy-speech/issues/108
const isAndroid = userAgent.includes('android')
const ttsPauseImplemented = !isAndroid && !isFirefoxLinux

export type TtsContextType = {
  enabled?: boolean
  canRead: boolean
  visible: boolean
  showTtsPlayer: () => void
  sentences: string[]
  setSentences: (sentences: string[]) => void
}

export const TtsContext = createContext<TtsContextType>({
  enabled: false,
  canRead: false,
  visible: false,
  showTtsPlayer: () => undefined,
  sentences: [],
  setSentences: () => undefined,
})

const initializedStatus = ['init: failed', 'created']
const ttsInitialized = () => !initializedStatus.some(status => EasySpeech.status().status.includes(status))

type TtsContainerProps = {
  languageCode: string
  children: ReactElement
}

const TtsContainer = ({ languageCode, children }: TtsContainerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const isPlayingRef = useRef<boolean>(false)
  const [isPlaying, internalSetIsPlaying] = useState<boolean>(false)
  const [visible, setVisible] = useState(false)
  const [sentences, setSentences] = useState<string[]>([])
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const title = sentences[0] || t('nothingToRead')
  const shortTitle = truncate(title, { maxChars: TTS_MAX_TITLE_DISPLAY_CHARS })
  const enabled = buildConfig().featureFlags.tts
  const canRead = enabled && sentences.length > 1

  const setIsPlaying = useCallback((isPlaying: boolean) => {
    isPlayingRef.current = isPlaying
    internalSetIsPlaying(isPlaying)
  }, [])

  const initializeTts = useCallback(() => {
    if (buildConfig().featureFlags.tts) {
      EasySpeech.init({ maxTimeout: 500, interval: 250 })
        .then(() => setVisible(true))
        .catch(e => {
          console.log(e)
          return setShowHelpModal(true)
        })
    }
  }, [])

  const stop = useCallback(() => {
    setIsPlaying(false)
    setSentenceIndex(0)
    if (ttsInitialized()) {
      console.log(EasySpeech.status().status)
      EasySpeech.cancel()
    }
  }, [setIsPlaying])

  const pause = () => {
    setIsPlaying(false)
    EasySpeech.cancel()
  }

  const play = useCallback(
    async (index = sentenceIndex) => {
      console.log(EasySpeech.status().status)
      const voice = ttsInitialized() ? EasySpeech.voices().find(voice => voice.lang.startsWith(languageCode)) : null
      if (!voice) {
        setShowHelpModal(true)
        return
      }

      const safeIndex = Math.max(0, index)
      const sentence = sentences[safeIndex]

      console.log(index, safeIndex, sentence)
      if (!sentence) {
        stop()
        return
      }

      setSentenceIndex(safeIndex)

      try {
        setIsPlaying(true)
        await EasySpeech.speak({
          text: sentence,
          voice,
          volume: 0.6,
          rate: 0.8,
          end: () => (isPlayingRef.current ? play(safeIndex + 1) : null),
        })
      } catch (e) {
        reportError(e)
      }
    },
    [sentenceIndex, setIsPlaying, sentences, stop, languageCode],
  )

  const close = () => {
    setVisible(false)
    setShowHelpModal(false)
    stop()
  }

  const updateSentences = useCallback(
    (newSentences: string[]) => {
      setSentences(newSentences)
      stop()
    },
    [stop],
  )

  const ttsContextValue = useMemo(
    () => ({
      enabled,
      canRead,
      visible,
      showTtsPlayer: initializeTts,
      sentences,
      setSentences: updateSentences,
    }),
    [enabled, canRead, visible, sentences, updateSentences, initializeTts],
  )

  return (
    <TtsContext.Provider value={ttsContextValue}>
      {children}
      {showHelpModal && <TtsHelpModal closeModal={close} />}
      {visible && (
        <TtsPlayer
          close={close}
          playPrevious={() => play(sentenceIndex - 1)}
          playNext={() => play(sentenceIndex + 1)}
          isPlaying={isPlaying}
          pause={pause}
          play={() => play()}
          title={shortTitle}
        />
      )}
    </TtsContext.Provider>
  )
}

export default TtsContainer
