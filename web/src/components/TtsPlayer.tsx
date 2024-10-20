import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import segment from 'sentencex'
import styled, { useTheme } from 'styled-components'

import { CloseIcon, NoSoundIcon, PauseIcon, PlaybackIcon, PlayIcon, SoundIcon } from '../assets'
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
  position: fixed;
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
      <p>This Voice is not available it needs to be installed</p>
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
  const synth = window.speechSynthesis

  const utteranceSetup = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance()
    utterance.text = sentences.slice(currentSentencesIndex).join(' ')
    utterance.onend = () => {
      setCurrentSentenceIndex(0)
      setIsPlaying(false)
      setExpandPlayer(false)
    }
    utterance.volume = volume
    return utterance
  }, [currentSentencesIndex, sentences, volume])

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

  useEffect(() => {
    const handleVoicesChanged = () => {
      const voices = synth.getVoices()

      const selectedVoice = voices.find(voice => voice.lang.startsWith(languageCode))

      if (selectedVoice) {
        utteranceSetup().voice = selectedVoice
      } else {
        setShowHelpModal(true)
        setSentences([])
      }
    }

    synth.addEventListener('voiceschanged', handleVoicesChanged)
    handleVoicesChanged()

    return () => {
      synth.cancel()
      synth.removeEventListener('voiceschanged', handleVoicesChanged)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageCode, synth])

  const startReading = () => {
    if (!isPlaying && synth.paused) {
      synth.resume()
      setIsPlaying(true)
    } else {
      synth.cancel()
      synth.speak(utteranceSetup())
      setIsPlaying(true)
    }
  }

  const pauseReading = () => {
    synth.pause()
    setIsPlaying(false)
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseReading()
    } else {
      startReading()
    }
    setExpandPlayer(!isPlaying)
  }

  const handleBackward = () => {
    if (isPlaying) {
      synth.cancel()
    }
    setCurrentSentenceIndex(prevIndex => Math.max(0, prevIndex - numOfSentencesToSkip))

    startReading()
  }

  const handleForward = () => {
    if (isPlaying) {
      synth.cancel()
    }
    setCurrentSentenceIndex(prevIndex => Math.min(prevIndex + numOfSentencesToSkip, sentences.length - 1))
    startReading()
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value)
    setVolume(newVolume)
    synth.cancel()
    startReading()
  }

  const handleClose = () => {
    setVisible(false)
    setExpandPlayer(false)
    synth.cancel()
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
