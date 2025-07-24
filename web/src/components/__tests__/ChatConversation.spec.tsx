import React from 'react'

import { ChatMessageModel } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import ChatConversation from '../ChatConversation'

jest.mock('react-i18next')
jest.mock('react-inlinesvg')

window.HTMLElement.prototype.scrollIntoView = jest.fn()
jest.useFakeTimers()

const render = (messages: ChatMessageModel[], hasError: boolean, isTyping: boolean) =>
  renderWithRouterAndTheme(<ChatConversation messages={messages} hasError={hasError} isTyping={isTyping} />)

describe('ChatConversation', () => {
  const testMessages: ChatMessageModel[] = [
    new ChatMessageModel({
      id: 1,
      content:
        '<b>Meine Frage lautet</b>, warum bei Integreat eigentlich alles gelb ist. <a rel="noopener" class="link-external" target="_blank" href="https://www.google.com" >Weitere Infos</a>',
      userIsAuthor: true,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 2,
      content:
        'Willkommen in der Integreat Chat Testumgebung auf Deutsch. Unser Team antwortet werktags, während unser Chatbot zusammenfassende Antworten aus verlinkten Artikeln liefert, die Sie zur Überprüfung wichtiger Informationen lesen sollten.',
      userIsAuthor: false,
      automaticAnswer: true,
    }),
    new ChatMessageModel({
      id: 3,
      content: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
      userIsAuthor: false,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 4,
      content: 'Wie kann ich mein Deutsch verbessern?',
      userIsAuthor: true,
      automaticAnswer: false,
    }),
  ]
  const testMessages2: ChatMessageModel[] = [
    new ChatMessageModel({
      id: 1,
      content: 'Human Message 1',
      userIsAuthor: false,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 2,
      content: 'Bot Message 1',
      userIsAuthor: false,
      automaticAnswer: true,
    }),
    new ChatMessageModel({
      id: 3,
      content: 'User Message 1',
      userIsAuthor: true,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 4,
      content: 'Human Message 2',
      userIsAuthor: false,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 5,
      content: 'Human Message 3',
      userIsAuthor: false,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 6,
      content: 'Bot Message 2',
      userIsAuthor: false,
      automaticAnswer: true,
    }),
    new ChatMessageModel({
      id: 7,
      content: 'Bot Message 3',
      userIsAuthor: false,
      automaticAnswer: true,
    }),
  ]

  it('should display welcome text if conversation has not started', () => {
    const { getByText } = render([], false, false)
    expect(getByText('chat:conversationTitle')).toBeTruthy()
    expect(getByText('chat:conversationText')).toBeTruthy()
  })

  it('should display messages if conversation has started and the initial message', () => {
    const { getByText, getByTestId } = render(testMessages, false, false)
    expect(getByText('chat:initialMessage')).toBeTruthy()
    expect(getByTestId(testMessages[0]!.id)).toBeTruthy()
    expect(getByTestId(testMessages[2]!.id)).toBeTruthy()
  })

  it('should display typing indicator', () => {
    const { getByText, getByTestId } = render(testMessages, false, true)
    expect(getByTestId(testMessages[0]!.id)).toBeTruthy()
    expect(getByTestId(testMessages[1]!.id)).toBeTruthy()
    expect(getByText('chat:human')).toBeTruthy()
    expect(getByText('...')).toBeTruthy()
  })

  it('should hide typing indicator if isTyping changes to false', () => {
    const botMessage = new ChatMessageModel({
      id: 20,
      content: 'Bot Message',
      userIsAuthor: false,
      automaticAnswer: true,
    })
    const { queryByText, rerender } = render(testMessages, false, true)
    expect(queryByText('...')).toBeTruthy()
    rerender(<ChatConversation messages={[...testMessages, botMessage]} hasError={false} isTyping={false} />)
    expect(queryByText('...')).toBeNull()
  })

  it('should display error messages if error occurs', () => {
    const { getByText } = render([], true, false)
    expect(getByText('chat:errorMessage')).toBeTruthy()
  })

  it('should display icon after automaticAnswer or author changes', () => {
    const expectedResults = [
      { icon: 'human', text: 'Human Message 1', opacity: '1' },
      { icon: 'bot', text: 'Bot Message 1', opacity: '1' },
      { icon: 'human', text: 'Human Message 2', opacity: '1' },
      { icon: 'human', text: 'Human Message 3', opacity: '0' },
      { icon: 'bot', text: 'Bot Message 2', opacity: '1' },
      { icon: 'bot', text: 'Bot Message 3', opacity: '0' },
    ]

    const { getAllByRole } = render(testMessages2, false, false)
    const icons = getAllByRole('img')

    expect(icons).toHaveLength(6)

    icons.forEach((icon, index) => {
      const expected = expectedResults[index]!
      const parent = icon.parentElement
      const grandparent = parent?.parentElement

      expect(icon.textContent).toMatch(expected.icon)
      expect(grandparent?.textContent).toMatch(expected.text)
      expect(parent).toHaveStyle(`opacity: ${expected.opacity}`)
    })
  })
})
