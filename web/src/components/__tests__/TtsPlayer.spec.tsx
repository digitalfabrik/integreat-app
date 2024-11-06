import { act, fireEvent, screen } from '@testing-library/react'
import EasySpeech from 'easy-speech'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import TtsContextProvider from '../../contexts/TtsContextProvider'
import useTtsPlayer from '../../hooks/useTtsPlayer'
import { renderWithTheme } from '../../testing/render'
import TtsPlayer from '../TtsPlayer'

jest.mock('react-i18next')
jest.mock('easy-speech')
jest.mock('tabbable')
jest.mock('sentencex', () => jest.fn(() => ['This is a test.']))

describe('TtsPlayer', () => {
  const TestChild = () => {
    const { setVisible } = useTtsPlayer('<p>This is a test.</p>', 'test')
    React.useEffect(() => {
      setVisible(true)
    }, [setVisible])
    return null
  }

  const renderTtsPlayer = () =>
    renderWithTheme(
      <MemoryRouter>
        <TtsContextProvider>
          <>
            <TestChild />
            <TtsPlayer languageCode='en' />
          </>
        </TtsContextProvider>
      </MemoryRouter>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should initialize TTS engine on load', async () => {
    await act(async () => {
      renderTtsPlayer()
    })

    expect(EasySpeech.init).toHaveBeenCalled()
  })

  it('should start reading when the button is pressed', async () => {
    await act(async () => {
      renderTtsPlayer()
    })

    const playButton = screen.getByRole('button', { name: 'play-button' })
    fireEvent.click(playButton)

    expect(playButton).toBeInTheDocument()

    expect(EasySpeech.speak).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'test. This is a test.',
        voice: { lang: 'en-US' },
        pitch: 1,
        rate: 1,
        volume: 0.5,
        boundary: expect.any(Function),
      }),
    )
  })

  it('should update volume when the slider is adjusted', async () => {
    await act(async () => {
      renderTtsPlayer()
    })

    const playBtn = screen.getByRole('button', { name: 'play-button' })
    fireEvent.click(playBtn)

    const volumeSlider = screen.getByRole('slider')
    expect(volumeSlider).toBeInTheDocument()

    fireEvent.change(volumeSlider, { target: { value: 0.8 } })
    fireEvent.click(playBtn)

    expect(EasySpeech.speak).toHaveBeenCalledWith(
      expect.objectContaining({
        volume: 0.8,
      }),
    )
  })

  it('should hide TtsPlayer and cancel speech when close button is clicked', async () => {
    await act(async () => {
      renderTtsPlayer()
    })

    const playButton = screen.getByRole('button', { name: 'play-button' })
    const ttsPlayer = screen.getByRole('dialog')
    fireEvent.click(playButton)

    const closeButton = screen.getByRole('button', { name: 'close-player' })
    fireEvent.click(closeButton)

    expect(EasySpeech.cancel).toHaveBeenCalled()

    expect(ttsPlayer).not.toBeInTheDocument()
  })

  it('should remove TTS listeners on unmount', () => {
    const { unmount } = renderTtsPlayer()

    unmount()

    expect(EasySpeech.cancel).toHaveBeenCalled()
  })
})
