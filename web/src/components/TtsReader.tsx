import React, { useState, useEffect, ReactElement } from 'react'

// List of void (self-closing) HTML elements
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

type TextToSpeechProps = {
  html: string
}

const TtsReader = ({ html }: TextToSpeechProps): ReactElement => {
  const [isPaused, setIsPaused] = useState(false)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [pitch, setPitch] = useState(1)
  const [rate, setRate] = useState(1)
  const [volume, setVolume] = useState(1)
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null)

  // Initialize utterance and voices
  useEffect(() => {
    const synth = window.speechSynthesis
    const u = new SpeechSynthesisUtterance()
    const handleVoicesChanged = () => {
      const voices = synth.getVoices()
      if (voices.length > 0) {
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
  }, [])

  // Update utterance when dependencies change
  useEffect(() => {
    if (utterance) {
      // Extract text from HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      utterance.text = tempDiv.textContent || tempDiv.innerText || ''

      utterance.pitch = pitch
      utterance.rate = rate
      utterance.volume = volume
      if (voice) {
        utterance.voice = voice
      }

      // Handle boundary events to track word progress
      const handleBoundary = (event: SpeechSynthesisEvent) => {
        if (event.name === 'word') {
          // Calculate word index based on charIndex
          const textUpToChar = utterance.text.substring(0, event.charIndex)
          const words = textUpToChar.split(/\s+/)
          const index = words.length - 1
          setCurrentWordIndex(index)
        }
      }

      utterance.onboundary = handleBoundary

      // Reset current word index when text changes
      setCurrentWordIndex(null)
    }
  }, [html, utterance, pitch, rate, volume, voice])

  // Handle play/resume
  const handlePlay = () => {
    const synth = window.speechSynthesis

    if (isPaused && synth.paused) {
      synth.resume()
      setIsPaused(false)
    } else if (utterance) {
      synth.speak(utterance)
    }
  }

  // Handle pause
  const handlePause = () => {
    const synth = window.speechSynthesis
    synth.pause()
    setIsPaused(true)
  }

  // Handle stop
  const handleStop = () => {
    const synth = window.speechSynthesis
    synth.cancel()
    setIsPaused(false)
    setCurrentWordIndex(null)
  }

  // Handle voice change
  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const voices = window.speechSynthesis.getVoices()
    const selectedVoice = voices.find(v => v.name === event.target.value)
    if (selectedVoice) {
      setVoice(selectedVoice)
      if (utterance) {
        utterance.voice = selectedVoice
      }
    }
  }

  // Handle pitch change
  const handlePitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPitch = parseFloat(event.target.value)
    setPitch(newPitch)
    if (utterance) {
      utterance.pitch = newPitch
    }
  }

  // Handle rate change
  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(event.target.value)
    setRate(newRate)
    if (utterance) {
      utterance.rate = newRate
    }
  }

  // Handle volume change
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value)
    setVolume(newVolume)
    if (utterance) {
      utterance.volume = newVolume
    }
  }

  // Get all words for rendering with highlights
  const renderContent = () => {
    let wordCount = 0
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const traverse = (node: Node): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent?.split(/(\s+)/) || []
        return words.map(word => {
          if (word.trim() === '') {
            return word
          }
          const currentIndex = wordCount
          wordCount += 1
          return (
            <span
              key={`word-${currentIndex}`}
              data-word-index={currentIndex}
              className={currentWordIndex === currentIndex ? 'highlight' : undefined}>
              {word}
            </span>
          )
        })
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        const tagName = element.tagName.toLowerCase()

        // Extract attributes
        const attrs: { [key: string]: any } = {}
        Array.from(element.attributes).forEach(attr => {
          if (attr.name === 'style') {
            // Parse style string into an object
            const styleObject: { [key: string]: string } = {}
            const styleString = attr.value
            styleString.split(';').forEach(styleRule => {
              if (styleRule.trim() === '') return
              const [property, value] = styleRule.split(':')
              if (property && value) {
                const camelCasedProperty = property.trim().replace(/-([a-z])/g, (_, char) => char.toUpperCase())
                styleObject[camelCasedProperty] = value.trim()
              }
            })
            attrs.style = styleObject
          } else if (attr.name === 'class') {
            attrs.className = attr.value
          } else if (attr.name === 'for') {
            attrs.htmlFor = attr.value
          } else {
            attrs[attr.name] = attr.value
          }
        })

        if (voidElements.has(tagName)) {
          // Render void elements without children
          return React.createElement(tagName, {
            key: `void-${tagName}-${wordCount}`,
            ...attrs,
          })
        }

        // Render non-void elements with children
        const children = Array.from(element.childNodes).map((child, index) => (
          <React.Fragment key={`element${index + 1}`}>{traverse(child)}</React.Fragment>
        ))
        return React.createElement(tagName, { key: `element-${tagName}-${wordCount}`, ...attrs }, children)
      }

      return null
    }

    return traverse(doc.body)
  }

  return (
    <div>
      <div>{renderContent()}</div>

      <label>
        Voice:
        <select value={voice?.name || ''} onChange={handleVoiceChange}>
          {window.speechSynthesis.getVoices().map(voiceOption => (
            <option key={voiceOption.name} value={voiceOption.name}>
              {voiceOption.name} ({voiceOption.lang})
            </option>
          ))}
        </select>
      </label>

      <br />

      <label>
        Pitch:
        <input type='range' min='0.5' max='2' step='0.1' value={pitch} onChange={handlePitchChange} />
        {pitch}
      </label>

      <br />

      <label>
        Speed:
        <input type='range' min='0.5' max='2' step='0.1' value={rate} onChange={handleRateChange} />
        {rate}
      </label>

      <br />
      <label>
        Volume:
        <input type='range' min='0' max='1' step='0.1' value={volume} onChange={handleVolumeChange} />
        {volume}
      </label>

      <br />

      <button type='button' onClick={handlePlay}>
        {isPaused ? 'Resume' : 'Play'}
      </button>
      <button type='button' onClick={handlePause}>
        Pause
      </button>
      <button type='button' onClick={handleStop}>
        Stop
      </button>

      {/* Styled-JSX block */}
      <style jsx>{`
        .highlight {
          background-color: yellow;
        }
      `}</style>
    </div>
  )
}

export default TtsReader
