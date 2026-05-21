import { DateTime } from 'luxon'
import React from 'react'

import { ChatMessageModel } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import ChatConversation from '../ChatConversation'

jest.mock('react-i18next')

window.HTMLElement.prototype.scrollIntoView = jest.fn()
jest.useFakeTimers()

const render = (messages: ChatMessageModel[], isTyping: boolean) =>
  renderWithRouterAndTheme(<ChatConversation messages={messages} isTyping={isTyping} />)

describe('ChatConversation', () => {
  const testMessages: ChatMessageModel[] = [
    new ChatMessageModel({
      id: 1,
      content: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
      created: DateTime.fromISO('2026-03-10T10:28:00.316Z'),
      userIsAuthor: true,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 2,
      content:
        'Willkommen in der Integreat Chat Testumgebung auf Deutsch. Unser Team antwortet werktags, während unser Chatbot zusammenfassende Antworten aus verlinkten Artikeln liefert, die Sie zur Überprüfung wichtiger Informationen lesen sollten.',
      created: DateTime.fromISO('2026-03-10T10:28:01.316Z'),
      userIsAuthor: false,
      automaticAnswer: true,
    }),
    new ChatMessageModel({
      id: 3,
      content:
        '<b>Meine Frage lautet</b>, warum bei Integreat eigentlich alles gelb ist. <a rel="noopener" class="link-external" target="_blank" href="https://www.google.com" >Weitere Infos</a>',
      created: DateTime.fromISO('2026-03-10T10:28:02.316Z'),
      userIsAuthor: false,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 4,
      content: 'Wie kann ich mein Deutsch verbessern?',
      created: DateTime.fromISO('2026-03-10T10:28:03.316Z'),
      userIsAuthor: true,
      automaticAnswer: false,
    }),
  ]
  const testMessages2: ChatMessageModel[] = [
    new ChatMessageModel({
      id: 1,
      content: 'Consultant Message 1',
      created: DateTime.fromISO('2026-03-10T10:28:04.316Z'),
      userIsAuthor: false,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 2,
      content: 'Bot Message 1',
      created: DateTime.fromISO('2026-03-10T10:28:05.316Z'),
      userIsAuthor: false,
      automaticAnswer: true,
    }),
    new ChatMessageModel({
      id: 3,
      content: 'User Message 1',
      created: DateTime.fromISO('2026-03-10T10:28:06.316Z'),
      userIsAuthor: true,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 4,
      content: 'Consultant Message 2',
      created: DateTime.fromISO('2026-03-10T10:28:07.316Z'),
      userIsAuthor: false,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 5,
      content: 'Consultant Message 3',
      created: DateTime.fromISO('2026-03-10T10:28:08.316Z'),
      userIsAuthor: false,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 6,
      content: 'Bot Message 2',
      created: DateTime.fromISO('2026-03-10T10:28:09.316Z'),
      userIsAuthor: false,
      automaticAnswer: true,
    }),
    new ChatMessageModel({
      id: 7,
      content: 'Bot Message 3',
      created: DateTime.fromISO('2026-03-10T10:28:10.316Z'),
      userIsAuthor: false,
      automaticAnswer: true,
    }),
  ]

  it('should display welcome text if conversation has not started', () => {
    const { getByText } = render([], false)
    expect(getByText('chat:conversationText')).toBeTruthy()
  })

  it('should display typing indicator', () => {
    const { getByText, getByLabelText } = render(testMessages, true)
    expect(getByText(testMessages[0]!.content)).toBeTruthy()
    expect(getByText(testMessages[1]!.content)).toBeTruthy()
    expect(getByLabelText('chat:consultant')).toBeTruthy()
    expect(getByLabelText('chat:generateAnswer')).toBeTruthy()
  })

  it('should hide typing indicator if isTyping changes to false', () => {
    const botMessage = new ChatMessageModel({
      id: 20,
      content: 'Bot Message',
      created: DateTime.fromISO('2026-03-10T10:28:00.316Z'),
      userIsAuthor: false,
      automaticAnswer: true,
    })
    const { queryByLabelText, rerender } = render(testMessages, true)
    expect(queryByLabelText('chat:generateAnswer')).toBeTruthy()
    rerender(<ChatConversation messages={[...testMessages, botMessage]} isTyping={false} />)
    expect(queryByLabelText('chat:generateAnswer')).toBeNull()
  })

  it('should display icon after automaticAnswer or author changes', () => {
    const expectedResults = [
      { label: 'chat:consultant', text: 'Consultant Message 1', opacity: '1' },
      { label: 'chat:bot', text: 'Bot Message 1', opacity: '1' },
      { label: 'chat:user', text: 'User Message 1', opacity: '1' },
      { label: 'chat:consultant', text: 'Consultant Message 2', opacity: '1' },
      { label: 'chat:consultant', text: 'Consultant Message 3', opacity: '0' },
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
