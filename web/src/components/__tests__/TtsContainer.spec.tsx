import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import EasySpeech from 'easy-speech'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'

import { PageModel } from 'shared/api'

import TtsContextProvider from '../../contexts/TtsContextProvider'
import useTtsPlayer from '../../hooks/useTtsPlayer'
import { renderWithTheme } from '../../testing/render'
import TtsContainer from '../TtsContainer'

jest.mock('react-i18next')
jest.mock('easy-speech')
jest.mock('sentencex', () => jest.fn(() => ['This is a test.']))
jest.mock('focus-trap-react', () => ({ children }: { children: ReactElement }) => <div>{children}</div>)

describe('TtsPlayer', () => {
  const dummyPage = new PageModel({
    path: '/test-path',
    title: 'test',
    content: '<p>This is a test.</p>',
    lastUpdate: DateTime.now(),
  })

  const testTtsObject = (text: string) => ({
    text,
    voice: { lang: 'en-US' },
    volume: 0.6,
    end: expect.any(Function),
  })

  const sentences = ['This is my first sentence', 'Second sentence', 'Third time is the charm']

  const TestChild = () => {
    const { setVisible, setSentences, visible } = useTtsPlayer('en', dummyPage)

    return (
      <>
        <button type='button' onClick={() => setSentences(sentences)}>
          set sentences
        </button>
        <button type='button' onClick={() => setVisible(true)}>
          show
        </button>
        {visible && <span>visible</span>}
      </>
    )
  }

  const renderTtsPlayer = () =>
    renderWithTheme(
      <MemoryRouter>
        <TtsContextProvider>
          <>
            <TestChild />
            <TtsContainer languageCode='en' />
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

  it('should show player when activated', async () => {
    await act(async () => {
      renderTtsPlayer()
    })
    fireEvent.click(screen.getByText('show'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should handle play/pause', async () => {
    await act(async () => {
      renderTtsPlayer()
    })
    fireEvent.click(screen.getByText('show'))
    const playButton = screen.getByRole('button', { name: 'layout:play' })
    fireEvent.click(playButton)

    expect(playButton).toBeInTheDocument()

    expect(EasySpeech.speak).toHaveBeenCalledWith(expect.objectContaining(testTtsObject('undefined')))
    fireEvent.click(screen.getByRole('button', { name: 'layout:pause' }))
    expect(EasySpeech.pause).toHaveBeenCalled()
    await waitFor(() => expect(screen.getByRole('button', { name: 'layout:play' })).toBeTruthy())
  })

  it('should hide TtsPlayer and cancel speech when close button is clicked', async () => {
    await act(async () => {
      renderTtsPlayer()
    })
    fireEvent.click(screen.getByText('show'))
    const playButton = screen.getByRole('button', { name: 'layout:play' })
    const ttsPlayer = screen.getByRole('dialog')
    fireEvent.click(playButton)

    const closeButton = screen.getByRole('button', { name: 'layout:common:close' })
    fireEvent.click(closeButton)

    expect(EasySpeech.cancel).toHaveBeenCalled()

    expect(ttsPlayer).not.toBeInTheDocument()
  })

  it('should play previous and next sentences', async () => {
    const { getByText, getByRole } = renderTtsPlayer()
    fireEvent.click(getByText('set sentences'))
    fireEvent.click(getByText('show'))

    await waitFor(() => expect(getByRole('button', { name: 'layout:play' })).toBeTruthy())

    fireEvent.click(getByRole('button', { name: 'layout:play' }))
    await waitFor(() => expect(getByRole('button', { name: 'layout:pause' })).toBeTruthy())

    fireEvent.click(getByRole('button', { name: 'layout:previous' }))
    await waitFor(() => expect(EasySpeech.speak).toHaveBeenCalledTimes(1))
    expect(EasySpeech.speak).toHaveBeenLastCalledWith(expect.objectContaining(testTtsObject(sentences[0]!)))

    fireEvent.click(getByRole('button', { name: 'layout:next' }))
    await waitFor(() => expect(EasySpeech.speak).toHaveBeenCalledTimes(2))
    expect(EasySpeech.speak).toHaveBeenLastCalledWith(expect.objectContaining(testTtsObject(sentences[1]!)))
    expect(EasySpeech.cancel).toHaveBeenCalledTimes(1)

    fireEvent.click(getByRole('button', { name: 'layout:next' }))
    await waitFor(() => expect(EasySpeech.speak).toHaveBeenCalledTimes(3))
    expect(EasySpeech.speak).toHaveBeenCalledWith(expect.objectContaining(testTtsObject(sentences[2]!)))
    expect(EasySpeech.cancel).toHaveBeenCalledTimes(2)

    fireEvent.click(getByRole('button', { name: 'layout:previous' }))
    await waitFor(() => expect(EasySpeech.speak).toHaveBeenCalledTimes(4))
    expect(EasySpeech.speak).toHaveBeenCalledWith(expect.objectContaining(testTtsObject(sentences[1]!)))
    expect(EasySpeech.cancel).toHaveBeenCalledTimes(3)

    fireEvent.click(getByRole('button', { name: 'layout:pause' }))
    await waitFor(() => expect(getByRole('button', { name: 'layout:play' })).toBeTruthy())
    expect(EasySpeech.cancel).toHaveBeenCalledTimes(3)

    fireEvent.click(getByRole('button', { name: 'layout:play' }))
    await waitFor(() => expect(getByRole('button', { name: 'layout:pause' })).toBeTruthy())
    expect(EasySpeech.speak).toHaveBeenCalledTimes(4)
    expect(EasySpeech.speak).toHaveBeenLastCalledWith(expect.objectContaining(testTtsObject(sentences[1]!)))
    expect(EasySpeech.cancel).toHaveBeenCalledTimes(3)
  })
})
