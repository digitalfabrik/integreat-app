import { act, fireEvent, screen } from '@testing-library/react'
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

  const TestChild = () => {
    const { setVisible } = useTtsPlayer('en', dummyPage)
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

  it('should start reading when the button is pressed', async () => {
    await act(async () => {
      renderTtsPlayer()
    })

    const playButton = screen.getByRole('button', { name: 'layout:play' })
    fireEvent.click(playButton)

    expect(playButton).toBeInTheDocument()

    expect(EasySpeech.speak).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'undefined',
        voice: { lang: 'en-US' },
        volume: 0.6,
        end: expect.any(Function),
      }),
    )
  })

  it('should hide TtsPlayer and cancel speech when close button is clicked', async () => {
    await act(async () => {
      renderTtsPlayer()
    })

    const playButton = screen.getByRole('button', { name: 'layout:play' })
    const ttsPlayer = screen.getByRole('dialog')
    fireEvent.click(playButton)

    const closeButton = screen.getByRole('button', { name: 'layout:common:close' })
    fireEvent.click(closeButton)

    expect(EasySpeech.cancel).toHaveBeenCalled()

    expect(ttsPlayer).not.toBeInTheDocument()
  })
})
