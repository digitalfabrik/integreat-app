import { act } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import { renderWithRouterAndTheme } from '../../testing/render'
import ChatConversation from '../ChatConversation'
import ChatMessage from '../ChatMessage'

jest.mock('react-i18next')
window.HTMLElement.prototype.scrollIntoView = jest.fn()
jest.useFakeTimers()

const render = (messages: ChatMessageModel[], hasError: boolean) =>
  renderWithRouterAndTheme(<ChatConversation messages={messages} hasError={hasError} />)

jest.mock('../ChatMessage')
mocked(ChatMessage).mockImplementation(jest.requireActual('../ChatMessage').default)

describe('ChatConversation', () => {
  const testMessages: ChatMessageModel[] = [
    new ChatMessageModel({
      id: 1,
      body: '<b>Meine Frage lautet</b>, warum bei Integreat eigentlich alles gelb ist. <a rel="noopener" class="link-external" target="_blank" href="https://www.google.com" >Weitere Infos</a>',
      userIsAuthor: true,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 2,
      body: 'Willkommen in der Integreat Chat Testumgebung auf Deutsch. Unser Team antwortet werktags, während unser Chatbot zusammenfassende Antworten aus verlinkten Artikeln liefert, die Sie zur Überprüfung wichtiger Informationen lesen sollten.',
      userIsAuthor: false,
      automaticAnswer: true,
    }),
    new ChatMessageModel({
      id: 3,
      body: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
      userIsAuthor: false,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 4,
      body: 'Wie kann ich mein Deutsch verbessern?',
      userIsAuthor: true,
      automaticAnswer: false,
    }),
  ]

  it('should display welcome text if conversation has not started', () => {
    const { getByText, debug } = render([], false)
    debug()
    expect(getByText('chat:conversationTitle')).toBeTruthy()
    expect(getByText('chat:conversationText')).toBeTruthy()
  })

  it('should display messages if conversation has started and the initial message', () => {
    const { getByText, getByTestId, getByAltText } = render(testMessages, false)
    expect(getByText('chat:initialMessage')).toBeTruthy()
    expect(getByTestId(testMessages[0]!.id)).toBeTruthy()
    expect(getByTestId(testMessages[2]!.id)).toBeTruthy()
  })

  it('should display typing indicator before the initial automatic answer and after for 60 seconds', () => {
    const { getByText, queryByText, getByTestId } = render(testMessages, false)
    expect(getByTestId(testMessages[0]!.id)).toBeTruthy()
    expect(getByText('...')).toBeTruthy()
    expect(getByTestId(testMessages[1]!.id)).toBeTruthy()
    expect(getByAltText('chat:my-alt-tag')).toBeTruthy()
    expect(getByText('...')).toBeTruthy()

    act(() => jest.runAllTimers())
    expect(queryByText('...')).toBeNull()
  })

  it('should display typing indicator after opening the chatbot with existing conversation for unanswered user message', () => {
    const { queryByText, getByTestId } = render(testMessages, false)
    expect(getByTestId(testMessages[3]!.id)).toBeTruthy()
    act(() => jest.runAllTimers())
    expect(queryByText('...')).toBeNull()
  })

  it('should display error messages if error occurs', () => {
    const { getByText, debug } = render([], true)
    debug()
    expect(getByText('chat:errorMessage')).toBeTruthy()
  })
})
