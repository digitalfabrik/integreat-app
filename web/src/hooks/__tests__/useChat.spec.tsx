import { act, renderHook } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'

import { uuid } from 'shared'
import { ChatMessageModel, RegionModelBuilder } from 'shared/api'

import { mockUseQueryFromEndpointWithData } from '../../testing/mockUseQueryFromEndpoint'
import { chatIdKey, chatSeenMessagesKey } from '../../utils/chat'
import useChat from '../useChat'
import { CHAT_UNSYNCED_MESSAGES_STORAGE_KEY } from '../useLocalStorage'

jest.mock('shared', () => ({
  ...jest.requireActual('shared'),
  uuid: jest.fn(),
}))
jest.mock('../useQueryFromEndpoint')

const region = new RegionModelBuilder(1).build()[0]!
const languageCode = 'de'

const createWrapper =
  (initialPath = `/${region.code}/${languageCode}`) =>
  ({ children }: { children: ReactNode }) => <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>

const renderUseChat = (initialPath?: string) =>
  renderHook(() => useChat({ region, languageCode }), { wrapper: createWrapper(initialPath) }).result

describe('useChat', () => {
  beforeEach(() => {
    jest.mocked(uuid).mockReturnValue('initial-id')
    mockUseQueryFromEndpointWithData({ messages: [], botTyping: false })
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('chatId', () => {
    it('should generate and persist a new chat id when none is stored yet', () => {
      const result = renderUseChat()

      expect(result.current.chatId).toBe('initial-id')
      expect(localStorage.getItem(chatIdKey(region.code))).toBe(JSON.stringify('initial-id'))
    })

    it('should use the previously stored chat id instead of generating a new one', () => {
      localStorage.setItem(chatIdKey(region.code), JSON.stringify('existing-id'))

      const result = renderUseChat()

      expect(result.current.chatId).toBe('existing-id')
    })

    it('should prefer the chatId query param over the stored chat id, without persisting it', () => {
      localStorage.setItem(chatIdKey(region.code), JSON.stringify('existing-id'))

      const result = renderUseChat(`/${region.code}/${languageCode}?chatId=external-id`)

      expect(result.current.chatId).toBe('external-id')
      expect(localStorage.getItem(chatIdKey(region.code))).toBe(JSON.stringify('existing-id'))
    })

    it('should reinitialize the chat id when the stored value is a literal null', () => {
      localStorage.setItem(chatIdKey(region.code), JSON.stringify(null))

      const result = renderUseChat()

      expect(result.current.chatId).toBe('initial-id')
      expect(localStorage.getItem(chatIdKey(region.code))).toBe(JSON.stringify('initial-id'))
    })
  })

  describe('unreadMessageCount', () => {
    it('should count only incoming messages', () => {
      mockUseQueryFromEndpointWithData({
        messages: [
          { userIsAuthor: true, content: 'my message' },
          { userIsAuthor: false, content: 'bot answer' },
          { userIsAuthor: false, content: 'another bot answer' },
        ],
        botTyping: false,
      })

      const result = renderUseChat()

      expect(result.current.unreadMessageCount).toBe(2)
    })

    it('should subtract previously seen messages', () => {
      localStorage.setItem(chatSeenMessagesKey(region.code), '1')
      mockUseQueryFromEndpointWithData({
        messages: [
          { userIsAuthor: false, content: 'first' },
          { userIsAuthor: false, content: 'second' },
          { userIsAuthor: false, content: 'third' },
        ],
        botTyping: false,
      })

      const result = renderUseChat()

      expect(result.current.unreadMessageCount).toBe(2)
    })
  })

  describe('markAsSeen', () => {
    it('should mark all currently incoming messages as seen', () => {
      mockUseQueryFromEndpointWithData({
        messages: [
          { userIsAuthor: false, content: 'first' },
          { userIsAuthor: false, content: 'second' },
        ],
        botTyping: false,
      })
      const result = renderUseChat()
      expect(result.current.unreadMessageCount).toBe(2)

      act(() => result.current.markAsSeen())

      expect(result.current.unreadMessageCount).toBe(0)
      expect(localStorage.getItem(chatSeenMessagesKey(region.code))).toBe('2')
    })

    it('should not reduce the seen count when fewer incoming messages are currently present', () => {
      localStorage.setItem(chatSeenMessagesKey(region.code), '5')
      mockUseQueryFromEndpointWithData({
        messages: [{ userIsAuthor: false, content: 'only one left' }],
        botTyping: false,
      })
      const result = renderUseChat()

      act(() => result.current.markAsSeen())

      expect(localStorage.getItem(chatSeenMessagesKey(region.code))).toBe('5')
    })
  })

  describe('resetChat', () => {
    it('should clear unsynced messages, assign a new chat id, and reset the seen count', () => {
      localStorage.setItem(chatIdKey(region.code), JSON.stringify('old-id'))
      localStorage.setItem(chatSeenMessagesKey(region.code), '4')
      localStorage.setItem(
        CHAT_UNSYNCED_MESSAGES_STORAGE_KEY,
        JSON.stringify([ChatMessageModel.unsyncedMessage('not yet sent')]),
      )
      jest.mocked(uuid).mockReturnValue('reset-id')

      const result = renderUseChat()

      act(() => result.current.resetChat())

      expect(result.current.chatId).toBe('reset-id')
      expect(result.current.serializedUnsyncedMessages).toEqual([])
      expect(localStorage.getItem(chatIdKey(region.code))).toBe(JSON.stringify('reset-id'))
      expect(localStorage.getItem(chatSeenMessagesKey(region.code))).toBe('0')
      expect(localStorage.getItem(CHAT_UNSYNCED_MESSAGES_STORAGE_KEY)).toBe('[]')
    })
  })
})
