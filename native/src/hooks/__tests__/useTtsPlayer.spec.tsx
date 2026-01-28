import { RenderAPI } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import { PageModel } from 'shared/api'

import { TtsContext } from '../../components/TtsContainer'
import TestingAppContext from '../../testing/TestingAppContext'
import renderWithTheme from '../../testing/render'
import useTtsPlayer from '../useTtsPlayer'

jest.mock('react-i18next')
jest.mock('../../hooks/useSnackbar')
jest.mock('../../components/TtsContainer')

jest.useFakeTimers()

describe('useTtsPlayer', () => {
  const setSentences = jest.fn()
  const oldSentences = ['old sentence 1.', 'old sentence 2.']
  const newSentences = ['new sentence 1.', 'new sentence 2.']

  const dummyPage = new PageModel({
    path: '/test-path',
    title: 'Test title',
    content: `<div></div><div>${newSentences[0]} ${newSentences[1]}</p></div>`,
    lastUpdate: DateTime.now(),
  })

  beforeEach(jest.clearAllMocks)

  const TestChild = ({ model }: { model?: PageModel }) => {
    useTtsPlayer(model)
    return null
  }

  const render = (model?: PageModel): RenderAPI =>
    renderWithTheme(
      <TestingAppContext languageCode='en'>
        <TtsContext.Provider
          value={{ setSentences, enabled: true, sentences: oldSentences, showTtsPlayer: jest.fn(), visible: false }}>
          <TestChild model={model} />
        </TtsContext.Provider>
      </TestingAppContext>,
    )

  it('should set new sentences and restore old sentences', () => {
    const { unmount } = render(dummyPage)
    expect(setSentences).toHaveBeenCalledTimes(1)
    expect(setSentences).toHaveBeenCalledWith(['Test title', ...newSentences])
    unmount()
    expect(setSentences).toHaveBeenCalledTimes(2)
    expect(setSentences).toHaveBeenLastCalledWith(oldSentences)
  })

  it('should set empty sentences and restore old sentences', () => {
    const { unmount } = render()
    expect(setSentences).toHaveBeenCalledTimes(1)
    expect(setSentences).toHaveBeenCalledWith([])
    unmount()
    expect(setSentences).toHaveBeenCalledTimes(2)
    expect(setSentences).toHaveBeenLastCalledWith(oldSentences)
  })
})
