import React from 'react'

import { ChatMessageModel } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import ChatConversation from '../ChatConversation'

jest.mock('react-i18next')
jest.mock('react-inlinesvg')

window.HTMLElement.prototype.scrollIntoView = jest.fn()
jest.useFakeTimers()

const render = (messages: ChatMessageModel[], isTyping: boolean) =>
  renderWithRouterAndTheme(<ChatConversation messages={messages} isTyping={isTyping} />)

describe('ChatConversation', () => {
  const testMessages: ChatMessageModel[] = [
    new ChatMessageModel({
      id: 1,
      content: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
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
      content:
        '<b>Meine Frage lautet</b>, warum bei Integreat eigentlich alles gelb ist. <a rel="noopener" class="link-external" target="_blank" href="https://www.google.com" >Weitere Infos</a>',
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
    const { getByText } = render([], false)
    expect(getByText('chat:conversationTitle')).toBeTruthy()
    expect(getByText('chat:conversationText')).toBeTruthy()
  })

  it('should display messages and initial message if no answer received yet', () => {
    const { getByText } = render(testMessages.slice(0, 1), false)
    expect(getByText('chat:initialMessage')).toBeTruthy()
    expect(getByText(testMessages[0]!.content)).toBeTruthy()
  })

  it('should not display help message message if answer received', () => {
    const { getByText, queryByText } = render(testMessages.slice(0, 2), false)
    expect(queryByText('chat:initialMessage')).toBeFalsy()
    expect(getByText(testMessages[0]!.content)).toBeTruthy()
    expect(getByText(testMessages[1]!.content)).toBeTruthy()
  })

  it('should display typing indicator', () => {
    const { getByText, getByLabelText } = render(testMessages, true)
    expect(getByText(testMessages[0]!.content)).toBeTruthy()
    expect(getByText(testMessages[1]!.content)).toBeTruthy()
    expect(getByLabelText('chat:human')).toBeTruthy()
    expect(getByText('...')).toBeTruthy()
  })

  it('should hide typing indicator if isTyping changes to false', () => {
    const botMessage = new ChatMessageModel({
      id: 20,
      content: 'Bot Message',
      userIsAuthor: false,
      automaticAnswer: true,
    })
    const { queryByText, rerender } = render(testMessages, true)
    expect(queryByText('...')).toBeTruthy()
    rerender(<ChatConversation messages={[...testMessages, botMessage]} isTyping={false} />)
    expect(queryByText('...')).toBeNull()
  })

  it('should display icon after automaticAnswer or author changes', () => {
    const expectedResults = [
      { label: 'chat:human', text: 'Human Message 1', opacity: '1' },
      { label: 'chat:bot', text: 'Bot Message 1', opacity: '1' },
      { label: 'chat:user', text: 'User Message 1', opacity: '1' },
      { label: 'chat:human', text: 'Human Message 2', opacity: '1' },
      { label: 'chat:human', text: 'Human Message 3', opacity: '0' },
      { label: 'chat:bot', text: 'Bot Message 2', opacity: '1' },
      { label: 'chat:bot', text: 'Bot Message 3', opacity: '0' },
    ]

    const { getAllByLabelText } = render(testMessages2, false)
    const avatars = getAllByLabelText(/chat:.*/)

    expect(avatars).toHaveLength(7)

    avatars.forEach((avatar, index) => {
      const expected = expectedResults[index]!
      const parent = avatar.parentElement
      const grandparent = parent?.parentElement

      expect(avatar).toHaveAttribute('aria-label', expected.label)
      expect(avatar).toHaveStyle(`opacity: ${expected.opacity}`)
      expect(grandparent?.textContent).toMatch(expected.text)
    })
  })
})
