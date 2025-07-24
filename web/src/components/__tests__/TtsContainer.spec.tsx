import { fireEvent, waitFor } from '@testing-library/react'
import EasySpeech from 'easy-speech'
import { mocked } from 'jest-mock'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'

import { PageModel } from 'shared/api'

import useTtsPlayer from '../../hooks/useTtsPlayer'
import { renderWithTheme } from '../../testing/render'
import TtsContainer from '../TtsContainer'

jest.mock('react-i18next')
jest.mock('easy-speech')
jest.mock('focus-trap-react', () => ({ children }: { children: ReactElement }) => <div>{children}</div>)

describe('TtsContainer', () => {
  // Mock call of end event after cancelling utterance
  mocked(EasySpeech.speak).mockImplementation(async ({ end }) => {
    // @ts-expect-error is always defined
    mocked(EasySpeech.cancel).mockImplementation(end)
  })
  // @ts-expect-error additional properties are missing but never used
  mocked(EasySpeech.status).mockImplementation(() => ({ status: 'init: complete' }))

  const dummyPage = new PageModel({
    path: '/test-path',
    title: 'test',
    content: '<p>This is a test.</p>',
    lastUpdate: DateTime.now(),
  })

  const testTtsObject = (text: string) => ({
    text,
    voice: { lang: 'en-GB', name: 'Daniel' },
    volume: 0.6,
    rate: 0.8,
    end: expect.any(Function),
  })

  const sentences = ['This is my first sentence', 'Second sentence', 'Third time is the charm']

  const TestChild = () => {
    const { showTtsPlayer, setSentences, visible } = useTtsPlayer(dummyPage, 'en')

    return (
      <>
        <button type='button' onClick={() => setSentences(sentences)}>
          set sentences
        </button>
        <button type='button' onClick={showTtsPlayer}>
          show
        </button>
        {visible && <span>visible</span>}
      </>
    )
  }

  const renderTtsPlayer = (languageCode = 'en') =>
    renderWithTheme(
      <MemoryRouter>
        <TtsContainer languageCode={languageCode}>
          <TestChild />
        </TtsContainer>
      </MemoryRouter>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should initialize tts and show player', async () => {
    const { getByText, getByRole } = renderTtsPlayer()
    fireEvent.click(getByText('show'))

    expect(EasySpeech.init).toHaveBeenCalled()
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument())
  })

  it('should correctly play and pause tts', async () => {
    const { getByText, getByTestId } = renderTtsPlayer()
    fireEvent.click(getByText('show'))
    await waitFor(() => expect(getByTestId('play-button')).toBeInTheDocument())
    fireEvent.click(getByTestId('play-button'))

    expect(EasySpeech.speak).toHaveBeenCalledWith(expect.objectContaining(testTtsObject('test')))
    fireEvent.click(getByTestId('pause-button'))
    expect(EasySpeech.cancel).toHaveBeenCalled()
    await waitFor(() => expect(getByTestId('play-button')).toBeTruthy())
  })

  it('should correctly play for Deutsch (leicht)', async () => {
    const { getByText, getByTestId } = renderTtsPlayer('de-si')
    fireEvent.click(getByText('show'))
    await waitFor(() => expect(getByTestId('play-button')).toBeInTheDocument())
    fireEvent.click(getByTestId('play-button'))

    expect(EasySpeech.speak).toHaveBeenCalledWith(
      expect.objectContaining({
        ...testTtsObject('test'),
        voice: { lang: 'de-DE', name: 'Anna' },
      }),
    )
  })

  it('should close and cancel utterance', async () => {
    const { getByText, queryByRole, getByTestId } = renderTtsPlayer()
    fireEvent.click(getByText('show'))
    await waitFor(() => expect(getByTestId('play-button')).toBeInTheDocument())
    fireEvent.click(getByTestId('play-button'))

    const closeButton = getByTestId('close-button')
    fireEvent.click(closeButton)

    expect(EasySpeech.cancel).toHaveBeenCalled()

    expect(queryByRole('dialog')).toBeFalsy()
  })

  it('should play previous and next sentences', async () => {
    const { getByText, getByTestId } = renderTtsPlayer()
    fireEvent.click(getByText('set sentences'))
    fireEvent.click(getByText('show'))

    await waitFor(() => expect(getByTestId('play-button')).toBeTruthy())

    fireEvent.click(getByTestId('play-button'))
    await waitFor(() => expect(getByTestId('pause-button')).toBeTruthy())
    await waitFor(() => expect(EasySpeech.speak).toHaveBeenCalledTimes(2))
    expect(EasySpeech.cancel).toHaveBeenCalledTimes(3)

    fireEvent.click(getByTestId('previous-button'))
    await waitFor(() => expect(EasySpeech.speak).toHaveBeenCalledTimes(3))
    expect(EasySpeech.speak).toHaveBeenLastCalledWith(expect.objectContaining(testTtsObject(sentences[0]!)))
    expect(EasySpeech.cancel).toHaveBeenCalledTimes(4)

    fireEvent.click(getByTestId('next-button'))
    await waitFor(() => expect(EasySpeech.speak).toHaveBeenCalledTimes(4))
    expect(EasySpeech.speak).toHaveBeenLastCalledWith(expect.objectContaining(testTtsObject(sentences[1]!)))
    expect(EasySpeech.cancel).toHaveBeenCalledTimes(5)

    fireEvent.click(getByTestId('next-button'))
    await waitFor(() => expect(EasySpeech.speak).toHaveBeenCalledTimes(5))
    expect(EasySpeech.speak).toHaveBeenCalledWith(expect.objectContaining(testTtsObject(sentences[2]!)))
    expect(EasySpeech.cancel).toHaveBeenCalledTimes(6)

    fireEvent.click(getByTestId('previous-button'))
    await waitFor(() => expect(EasySpeech.speak).toHaveBeenCalledTimes(6))
    expect(EasySpeech.speak).toHaveBeenCalledWith(expect.objectContaining(testTtsObject(sentences[1]!)))
    expect(EasySpeech.cancel).toHaveBeenCalledTimes(7)

    fireEvent.click(getByTestId('pause-button'))
    await waitFor(() => expect(getByTestId('play-button')).toBeTruthy())
    expect(EasySpeech.cancel).toHaveBeenCalledTimes(8)

    fireEvent.click(getByTestId('play-button'))
    await waitFor(() => expect(getByTestId('pause-button')).toBeTruthy())
    expect(EasySpeech.speak).toHaveBeenCalledTimes(7)
    expect(EasySpeech.speak).toHaveBeenLastCalledWith(expect.objectContaining(testTtsObject(sentences[1]!)))
    expect(EasySpeech.cancel).toHaveBeenCalledTimes(8)
  })
})
