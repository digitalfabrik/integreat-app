import { act, fireEvent, screen } from '@testing-library/react'
import EasySpeech from 'easy-speech'
import React from 'react'

import useTtsPlayer from '../../hooks/useTtsPlayer'
import { renderWithTheme } from '../../testing/render'
import TtsPlayer from '../TtsPlayer'

jest.mock('react-i18next')
jest.mock('easySpeech')
jest.mock('sentencex', () => jest.fn())

describe('TtsPlayer', () => {
  const TestChild = () => {
    const { setVisible } = useTtsPlayer('<p>This is a test</p>', 'test')
    setVisible(true)
    return null
  }

  const renderTtsPlayer = () => renderWithTheme(<TtsPlayer languageCode='en' />)

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should initialize TTS engine on load', async () => {
    renderTtsPlayer()
    expect(EasySpeech.init).toHaveBeenCalled()
  })

  it('should start reading when the button is pressed', async () => {
    const { getByRole } = renderTtsPlayer()

    // Advance any pending timers or effects
    act(() => {
      jest.runAllTimers()
    })

    const playButton = screen.getByRole('button', { name: 'play-button' })
    fireEvent.click(playButton)

    expect(EasySpeech.speak).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'This is a test.',
        voice: undefined, // Or mock voice if defined
        pitch: 1,
        rate: 1,
        volume: 1,
        boundary: expect.any(Function),
      }),
      'This is a test.',
      undefined,
      undefined,
    )
  })

  it('should remove TTS listeners on unmount', () => {
    const { unmount } = renderTtsPlayer()

    unmount()

    expect(EasySpeech.reset).toHaveBeenCalled()
  })
})
