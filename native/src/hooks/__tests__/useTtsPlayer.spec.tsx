import { RenderAPI } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import { DocumentModel } from 'shared/api'

import { TtsContext } from '../../components/TtsContainer'
import TestingAppContext from '../../testing/TestingAppContext'
import renderWithTheme from '../../testing/render'
import useTtsPlayer from '../useTtsPlayer'

jest.mock('../../hooks/useSnackbar')
jest.mock('../../components/TtsContainer')

jest.useFakeTimers()

describe('useTtsPlayer', () => {
  const setSentences = jest.fn()
  const oldSentences = ['old sentence 1.', 'old sentence 2.']
  const newSentences = ['new sentence 1.', 'new sentence 2.']

  const dummyDocument = new DocumentModel({
    path: '/test-path',
    title: 'Test title',
    content: `<div></div><div>${newSentences[0]} ${newSentences[1]}</p></div>`,
    lastUpdate: DateTime.now(),
  })

  beforeEach(jest.clearAllMocks)

  type TestChildProps = { model?: DocumentModel; title?: string; childTitles?: string[] }

  const TestChild = ({ model, title, childTitles }: TestChildProps) => {
    useTtsPlayer(model, { title, childTitles })
    return null
  }

  const render = (model?: DocumentModel, options: Omit<TestChildProps, 'model'> = {}): RenderAPI =>
    renderWithTheme(
      <TestingAppContext languageCode='en'>
        <TtsContext.Provider
          value={{ setSentences, sentences: oldSentences, showTtsPlayer: jest.fn(), visible: false }}>
          <TestChild model={model} {...options} />
        </TtsContext.Provider>
      </TestingAppContext>,
    )

  it('should set new sentences and restore old sentences', () => {
    const { unmount } = render(dummyDocument)
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

  it('should read child titles after the content', () => {
    render(dummyDocument, { childTitles: ['Child 1', 'Child 2'] })
    expect(setSentences).toHaveBeenCalledWith(['Test title', ...newSentences, 'Child 1', 'Child 2'])
  })

  it('should read child titles of pages without content', () => {
    const emptyDocument = new DocumentModel({ path: '/empty', title: 'Empty', content: '', lastUpdate: DateTime.now() })
    render(emptyDocument, { childTitles: ['Child 1', 'Child 2'] })
    expect(setSentences).toHaveBeenCalledWith(['Empty', 'Child 1', 'Child 2'])
  })

  it('should use the passed title instead of the model title', () => {
    render(dummyDocument, { title: 'Augsburg', childTitles: ['Child 1'] })
    expect(setSentences).toHaveBeenCalledWith(['Augsburg', ...newSentences, 'Child 1'])
  })

  it('should set empty sentences if there is neither content nor children', () => {
    const emptyDocument = new DocumentModel({ path: '/empty', title: 'Empty', content: '', lastUpdate: DateTime.now() })
    render(emptyDocument, { childTitles: [] })
    expect(setSentences).toHaveBeenCalledWith([])
  })
})
