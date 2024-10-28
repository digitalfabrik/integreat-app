import EasySpeech from 'easy-speech'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import segment from 'sentencex'
import styled, { useTheme } from 'styled-components'

import { CloseIcon, NoSoundIcon, PauseIcon, PlaybackIcon, PlayIcon, SoundIcon } from '../assets'
import { reportError } from '../utils/sentry'
import Modal from './Modal'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledTtsPlayer = styled.dialog<{ $isPlaying: boolean }>`
  background-color: #dedede;
  border-radius: 28px;
  width: 388px;
  display: flex;
  flex-direction: ${props => (props.$isPlaying ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  align-self: center;
  padding: 6px;
  position: sticky;
  bottom: 5px;
  min-height: 93px;
  gap: ${props => (props.$isPlaying ? '5px;' : '10px')};
  border-color: transparent;
`
const StyledPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  padding: 0 10px;
`
const StyledPlayIcon = styled(Button)`
  background-color: #232323;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledBackForthButton = styled(Button)`
  display: flex;
  flex-direction: ${props => (props.theme.contentDirection === 'rtl' ? 'row-reverse ' : 'row')};
  gap: 5px;
  align-items: flex-end;
`

const PlayButtonIcon = styled(Icon)`
  color: #dedede;
`
const StyledNoSoundIcon = styled(Icon)`
  height: 18px;
  width: 18px;
`

const BackForthIcon = styled(Icon)<{ $flip: boolean }>`
  transform: ${props => (props.$flip ? 'scaleX(-1)' : '')};
`

const StyledText = styled.span`
  font-weight: bold;
`

const StyledPlayerHeaderText = styled.span`
  font-weight: 600;
  align-self: center;
  font-size: 18px;
`

const CloseButton = styled(Button)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 5px;
  gap: 5px;
  width: 176px;
  box-shadow: 1px 1px 10px 1px grey;
`

const CloseView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`

const ModalContent = styled.div`
  padding: 20px;
`

const Slider = styled.input`
  border-radius: 25px;
  appearance: none;
  background: #b9b9b9;

  &::-ms-track {
    border-radius: 25px;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #333;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #333;
    cursor: pointer;
  }
`
const HelpModal = ({ closeModal }: { closeModal: () => void }) => (
  <Modal title='' closeModal={closeModal}>
    <ModalContent>
      <h3>This voice is not available right now; it requires installation for the selected language.</h3>
      <ul>
        <li>
          <a
            href='https://support.microsoft.com/en-us/topic/download-languages-and-voices-for-immersive-reader-read-mode-and-read-aloud-4c83a8d8-7486-42f7-8e46-2b0fdf753130'
            target='_blank'
            rel='noreferrer'>
            Windows
          </a>
        </li>
        <li>
          <a
            href='https://support.apple.com/guide/mac-help/change-the-voice-your-mac-uses-to-speak-text-mchlp2290/mac'
            target='_blank'
            rel='noreferrer'>
            MacOS
          </a>
        </li>
        <li>
          <a
            href='https://github.com/espeak-ng/espeak-ng/blob/master/docs/mbrola.md#installation-of-standard-packages'
            target='_blank'
            rel='noreferrer'>
            Ubuntu
          </a>
        </li>
        <li>
          <a
            href='https://support.google.com/accessibility/android/answer/6006983?hl=en&sjid=9301509494880612166-EU'
            target='_blank'
            rel='noreferrer'>
            Android
          </a>
        </li>
        <li>
          <a href='https://support.apple.com/en-us/HT202362' target='_blank' rel='noreferrer'>
            iOS
          </a>
        </li>
      </ul>
    </ModalContent>
  </Modal>
)
type TtsPlayerProps = {
  html: string
  initialVisibility?: boolean
  languageCode: string
}

const TtsPlayer = ({ initialVisibility = false, html, languageCode }: TtsPlayerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const theme = useTheme()
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [expandPlayer, setExpandPlayer] = useState(false)
  const defaultVolume = 0.5
  const [volume, setVolume] = useState(defaultVolume)
  const [visible, setVisible] = useState(initialVisibility)
  const [currentSentencesIndex, setCurrentSentenceIndex] = useState<number>(0)
  const [sentences, setSentences] = useState<string[]>([])
  const [showHelpModal, setShowHelpModal] = useState(false)
  const numOfSentencesToSkip = 1
  const EasySpeechInfo = EasySpeech.detect()
  const allowIncrement = useRef(true)

  const handleBoundary = (event: SpeechSynthesisEvent) => {
    if (event.name === 'sentence' && allowIncrement.current) {
      setCurrentSentenceIndex((prevIndex: number) => prevIndex + 1)
    }
    allowIncrement.current = true
    if (currentSentencesIndex >= sentences.length - 1) {
      setCurrentSentenceIndex(0)
      setIsPlaying(false)
      setExpandPlayer(false)
    }
  }

  useEffect(() => {
    EasySpeech.init({ maxTimeout: 5000, interval: 250 }).catch(e => reportError(e))
    return () => {
      EasySpeech.cancel()
      setCurrentSentenceIndex(0)
    }
  }, [])

  useEffect(() => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    const appendPeriod = (elements: NodeListOf<HTMLElement>) => {
      elements.forEach((element: HTMLElement) => {
        const trimmedText = element.textContent?.trim()
        if (trimmedText && !trimmedText.endsWith('.')) {
          // eslint-disable-next-line no-param-reassign
          element.textContent = trimmedText.concat('.')
        }
      })
    }

    const listItems = tempDiv.querySelectorAll('li')
    appendPeriod(listItems)

    const paragraphs = tempDiv.querySelectorAll('p')
    appendPeriod(paragraphs)

    const textContent = tempDiv.textContent || tempDiv.innerText
    setSentences(segment(languageCode, textContent))
    setCurrentSentenceIndex(0)
  }, [html, languageCode])

  const startReading = async (index = currentSentencesIndex) => {
    EasySpeech.cancel()
    const voices = EasySpeech.voices()
    const selectedVoice = voices.find((voice: SpeechSynthesisVoice) => voice.lang.startsWith(languageCode))
    if (selectedVoice == null) {
      setSentences([])
      setShowHelpModal(true)
      return
    }
    await EasySpeech.speak({
      text: sentences.slice(index).join(' '),
      voice: selectedVoice,
      pitch: 1,
      rate: 1,
      volume,
      boundary: e => handleBoundary(e),
    }).catch(() => null)
  }

  const pauseReading = () => {
    EasySpeech.pause()
    setIsPlaying(false)
  }
  const withSkip = async (action: () => Promise<void>) => {
    allowIncrement.current = true
    try {
      await action()
    } finally {
      allowIncrement.current = false
    }
  }
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseReading()
    } else if (currentSentencesIndex !== 0) {
      setIsPlaying(true)
      EasySpeech.resume()
    } else {
      setIsPlaying(true)
      withSkip(() => startReading())
    }
    setExpandPlayer(!isPlaying)
  }

  const handleForward = () => {
    if (isPlaying) {
      EasySpeech.cancel()
    }
    setCurrentSentenceIndex(prevIndex => {
      const newIndex = Math.min(prevIndex + numOfSentencesToSkip, sentences.length - 1)
      withSkip(() => startReading(newIndex))
      return newIndex
    })
  }

  const handleBackward = () => {
    if (isPlaying) {
      EasySpeech.cancel()
    }
    setCurrentSentenceIndex(prevIndex => {
      const newIndex = Math.max(0, prevIndex - numOfSentencesToSkip)
      withSkip(() => startReading(newIndex))
      return newIndex
    })
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value)
    setVolume(newVolume)
    EasySpeech.cancel()
    withSkip(() => startReading())
  }

  const handleClose = () => {
    setVisible(false)
    setExpandPlayer(false)
    EasySpeech.cancel()
    setIsPlaying(false)
  }
  if (visible) {
    return (
      <>
        {showHelpModal && <HelpModal closeModal={() => setShowHelpModal(false)} />}
        <StyledTtsPlayer $isPlaying={expandPlayer}>
          <StyledPanel style={{ flexDirection: theme.contentDirection === 'rtl' ? 'row-reverse' : 'row' }}>
            {expandPlayer && (
              <StyledBackForthButton label='Backward Button' onClick={handleBackward}>
                <StyledText>{t('prev')}</StyledText>
                <BackForthIcon $flip src={PlaybackIcon} />
              </StyledBackForthButton>
            )}
            <StyledPlayIcon label='Play Button' onClick={togglePlayPause}>
              <PlayButtonIcon src={isPlaying ? PauseIcon : PlayIcon} />
            </StyledPlayIcon>
            {expandPlayer && (
              <StyledBackForthButton label='Forward Button' onClick={handleForward}>
                <BackForthIcon $flip={false} src={PlaybackIcon} />
                <StyledText>{t('next')}</StyledText>
              </StyledBackForthButton>
            )}
          </StyledPanel>
          {expandPlayer && (
            <StyledPanel>
              <StyledNoSoundIcon src={NoSoundIcon} />
              <Slider type='range' min='0' max='1' step='0.1' value={volume} onChange={handleVolumeChange} />
              <Icon src={SoundIcon} />
            </StyledPanel>
          )}
          <CloseView>
            {!expandPlayer && <StyledPlayerHeaderText>{t('readAloud')}</StyledPlayerHeaderText>}
            <CloseButton label='Close player' onClick={handleClose}>
              <Icon src={CloseIcon} />
              <StyledText>{t('common:close')}</StyledText>
            </CloseButton>
          </CloseView>
        </StyledTtsPlayer>
      </>
    )
  }
  return null
}

export default TtsPlayer
