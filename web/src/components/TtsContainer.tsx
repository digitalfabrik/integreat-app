import EasySpeech from 'easy-speech'
import React, { createContext, ReactElement, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import { getTtsVoice, isTtsCancelError, ttsInitialized } from '../utils/tts'
import TtsHelpModal from './TtsHelpModal'
import TtsPlayer from './TtsPlayer'

const TTS_TIMEOUT = 5000
const TTS_RETRY_INTERVAL = 250

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

type TtsContainerProps = {
  languageCode: string
  children: ReactElement
}

const TtsContainer = ({ languageCode, children }: TtsContainerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const afterStopRef = useRef<(() => void) | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [visible, setVisible] = useState(false)
  const [sentences, setSentences] = useState<string[]>([])
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const title = sentences[0] || t('nothingToRead')
  const enabled = buildConfig().featureFlags.tts
  const canRead = enabled && sentences.length > 1

  const initializeTts = useCallback(() => {
    if (buildConfig().featureFlags.tts) {
      EasySpeech.init({ maxTimeout: TTS_TIMEOUT, interval: TTS_RETRY_INTERVAL })
        .then(() => setVisible(true))
        .catch(() => setShowHelpModal(true))
    }
  }, [])

  const stopPlayer = useCallback((afterStop: () => void = () => undefined) => {
    if (ttsInitialized()) {
      // The end event is always emitted if the current utterance is stopped (incl. finish, cancel and pause)
      // The end event is only emitted after some time, such that we can only start the next utterance after to avoid autoplaying the next utterance
      // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/end_event
      afterStopRef.current = afterStop
      EasySpeech.cancel()
    }
  }, [])

  const stop = useCallback(() => {
    setSentenceIndex(0)
    setIsPlaying(false)
    stopPlayer()
  }, [stopPlayer])

  const pause = () => {
    setIsPlaying(false)
    stopPlayer()
  }

  const play = useCallback(
    async (index = sentenceIndex) => {
      const voice = getTtsVoice(languageCode)
      if (!voice) {
        setShowHelpModal(true)
        return
      }

      const safeIndex = Math.max(0, index)
      const sentence = sentences[safeIndex]

      if (sentence === undefined) {
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
          end: () => {
            // We only want to play the next sentence if the current utterance is finished and the user did not stop it manually
            // Otherwise, execute afterStop (play previous or next sentence for playPrevious/Next or noop for stop)
            if (afterStopRef.current) {
              afterStopRef.current()
              afterStopRef.current = null
            } else {
              play(safeIndex + 1)
            }
          },
        })
      } catch (e) {
        // Chrome and Safari throw an interrupted/canceled error event on cancel instead of emitting an end event
        if (isTtsCancelError(e)) {
          if (afterStopRef.current) {
            afterStopRef.current()
            afterStopRef.current = null
          }
        } else {
          reportError(e)
        }
      }
    },
    [sentenceIndex, setIsPlaying, sentences, stop, languageCode],
  )

  const startPlaying = () => {
    afterStopRef.current = null
    play()
  }

  const close = () => {
    setVisible(false)
    setShowHelpModal(false)
    stop()
  }

  const playPrevious = () => (isPlaying ? stopPlayer(() => play(sentenceIndex - 1)) : play(sentenceIndex - 1))
  const playNext = () => (isPlaying ? stopPlayer(() => play(sentenceIndex + 1)) : play(sentenceIndex + 1))

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
          disabled={sentences.length === 0}
          close={close}
          playPrevious={playPrevious}
          playNext={playNext}
          isPlaying={isPlaying}
          pause={pause}
          play={startPlaying}
          title={title}
        />
      )}
    </TtsContext.Provider>
  )
}

export default TtsContainer
