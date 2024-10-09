import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CloseIcon, NoSoundIcon, PauseIcon, PlaybackIcon, PlayIcon, SoundIcon } from '../assets'
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
  flex-direction: row;
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
const Slider = styled.input`
  border-radius: 25px;
  -webkit-appearance: none;
  background: #b9b9b9;

  &::-ms-track {
    border-radius: 25px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
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

const StyledWord = styled.span<{ isCurrent: boolean }>`
  background-color: ${props => (props.isCurrent ? 'yellow' : 'transparent')};
`
const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

type TtsPlayerProps = {
  html: string
  initialVisibility?: boolean
  languageCode: string
}

const TtsPlayer = ({ initialVisibility = false, html, languageCode }: TtsPlayerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [expandPlayer, setExpandPlayer] = useState(false)
  const defaultVolume = 0.5
  const [volume, setVolume] = useState(defaultVolume)
  const [visible, setVisible] = useState(initialVisibility)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0)
  const [words, setWords] = useState<string[]>([])
  const numOfWordsToSkip = 10

  const synth = window.speechSynthesis

  // Parse HTML and split into words
  useEffect(() => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    const textContent = tempDiv.textContent || tempDiv.innerText || ''
    const wordsArray = textContent.split(/\s+/).filter(word => word.trim() !== '')
    setWords(wordsArray)
    setCurrentWordIndex(0)
  }, [html])

  const handleBoundary = (event: SpeechSynthesisEvent) => {
    if (event.name === 'word') {
      setCurrentWordIndex(prevIndex => prevIndex + 1)
    }
  }

  useEffect(() => {
    const u = new SpeechSynthesisUtterance()

    const handleVoicesChanged = () => {
      const voices = synth.getVoices()

      // Select voice matching the passed languageCode
      const selectedVoice = voices.find(voice => voice.lang.startsWith(languageCode))

      if (selectedVoice) {
        setVoice(selectedVoice)
        u.voice = selectedVoice
      } else if (voices.length > 0) {
        // Fallback to the first available voice if no match is found
        setVoice(voices[0])
        u.voice = voices[0]
      }
    }

    synth.addEventListener('voiceschanged', handleVoicesChanged)
    handleVoicesChanged()

    setUtterance(u)

    return () => {
      synth.cancel()
      synth.removeEventListener('voiceschanged', handleVoicesChanged)
    }
  }, [languageCode, synth])

  useEffect(() => {
    if (utterance) {
      const textToSpeak = words.slice(currentWordIndex).join(' ')
      utterance.text = textToSpeak
      utterance.volume = volume
      if (voice) {
        utterance.voice = voice
      }
      utterance.onboundary = handleBoundary
    }
  }, [words, currentWordIndex, utterance, volume, voice])

  const startReading = () => {
    if (!isPlaying && synth.paused) {
      synth.resume()
      setIsPlaying(true)
    } else if (utterance) {
      synth.cancel()
      synth.speak(utterance)
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
    setCurrentWordIndex(prevIndex => Math.max(0, prevIndex - numOfWordsToSkip))
    if (isPlaying) {
      synth.cancel()
      setTimeout(() => {
        if (utterance) {
          startReading()
        }
      }, 100)
    }
  }

  const handleForward = () => {
    setCurrentWordIndex(prevIndex => Math.min(prevIndex + numOfWordsToSkip, words.length - 1))
    if (isPlaying) {
      synth.cancel()
      setTimeout(() => {
        if (utterance) {
          startReading()
        }
      }, 100)
    }
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value)
    setVolume(newVolume)

    if (utterance) {
      synth.cancel()
      startReading()
    }
  }

  const handleClose = () => {
    setVisible(false)
    setExpandPlayer(false)
    synth.cancel()
    setIsPlaying(false)
  }

  const renderContent = useCallback(() => {
    let wordCount = 0
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const traverse = (node: Node): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent || ''
        const wordsInNode = textContent.split(/(\s+)/)
        return wordsInNode.map(word => {
          if (word.trim() === '') {
            // Return whitespace as is
            return word
          }
          const currentIndex = wordCount
          wordCount += 1
          return (
            <StyledWord
              key={`word-${currentIndex}`}
              data-word-index={currentIndex}
              isCurrent={currentWordIndex === currentIndex}>
              {word}
            </StyledWord>
          )
        })
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        const tagName = element.tagName.toLowerCase()

        const attrs: { [key: string]: string } = {}
        Array.from(element.attributes).forEach(attr => {
          const attrName = attr.name === 'class' ? 'className' : attr.name === 'for' ? 'htmlFor' : attr.name

          if (attrName === 'style') {
            const tempElement = document.createElement('div')
            tempElement.style.cssText = attr.value
            const styleObject: { [key: string]: string } = {}
            for (let i = 0; i < tempElement.style.length; i++) {
              const propertyName = tempElement.style[i]
              const propertyValue = tempElement.style.getPropertyValue(propertyName)
              styleObject[propertyName] = propertyValue
            }
            attrs.style = styleObject
          } else {
            attrs[attrName] = attr.value
          }
        })

        if (voidElements.has(tagName)) {
          return React.createElement(tagName, {
            key: `void-${tagName}-${wordCount}`,
            ...attrs,
          })
        }

        const children = Array.from(element.childNodes).map(child => traverse(child))

        return React.createElement(tagName, { key: `element-${tagName}-${wordCount}`, ...attrs }, children)
      }

      return null
    }

    return traverse(doc.body)
  }, [currentWordIndex, html])

  return (
    <div>
      {visible && (
        <StyledTtsPlayer $isPlaying={expandPlayer}>
          <StyledPanel>
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
      )}
      <div>{renderContent()}</div>
    </div>
  )
}

export default TtsPlayer
