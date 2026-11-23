import { act, renderHook } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'

import { uuid } from 'shared'
import { ChatMessageModel, rateLimitRetryOptions, RegionModel, RegionModelBuilder } from 'shared/api'

import { mockUseQueryFromEndpointWithData } from '../../testing/mockUseQueryFromEndpoint'
import { chatIdKey, chatSeenMessagesKey } from '../../utils/chat'
import useChat from '../useChat'
import { CHAT_UNSYNCED_MESSAGES_STORAGE_KEY } from '../useLocalStorage'
import useQueryFromEndpoint from '../useQueryFromEndpoint'

jest.mock('shared', () => ({
  ...jest.requireActual('shared'),
  uuid: jest.fn(),
}))
jest.mock('../useQueryFromEndpoint')

const chatDisabledRegion = new RegionModelBuilder(1).build()[0]!
const region: RegionModel = Object.assign(Object.create(RegionModel.prototype), chatDisabledRegion, {
  _chatEnabled: true,
})
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
    it('should not create a chat id when none is stored and the chat is not opened', () => {
      const result = renderUseChat()

      expect(result.current.chatId).toBeNull()
      expect(localStorage.getItem(chatIdKey(region.code))).toBe(JSON.stringify(null))
    })

    it('should persist the generated chat id once the chat is opened', () => {
      const result = renderUseChat(`/${region.code}/${languageCode}?chat=true`)

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

    it('should not create a chat id if the chat is disabled for the region', () => {
      const { result } = renderHook(() => useChat({ region: chatDisabledRegion, languageCode }), {
        wrapper: createWrapper(`/${region.code}/${languageCode}?chat=true`),
      })

      expect(result.current.chatId).toBeNull()
      expect(localStorage.getItem(chatIdKey(region.code))).toBe(JSON.stringify(null))
    })

    it('should not persist the external chat id when opening the chat', () => {
      renderUseChat(`/${region.code}/${languageCode}?chat=true&chatId=external-id`)

      expect(localStorage.getItem(chatIdKey(region.code))).toBe(JSON.stringify(null))
    })
  })

  describe('loading messages', () => {
    const enabledOption = () => jest.mocked(useQueryFromEndpoint).mock.lastCall?.[3]?.enabled

    beforeEach(() => {
      jest.mocked(useQueryFromEndpoint).mockClear()
    })

    it('should not load messages if the chat was never opened', () => {
      renderUseChat()
      expect(enabledOption()).toBe(false)
    })

    it('should not load messages if a null chat id is stored', () => {
      localStorage.setItem(chatIdKey(region.code), JSON.stringify(null))
      renderUseChat()
      expect(enabledOption()).toBe(false)
    })

    it('should load messages if a chat id is stored', () => {
      localStorage.setItem(chatIdKey(region.code), JSON.stringify('existing-id'))
      renderUseChat()
      expect(enabledOption()).toBe(true)
    })

    it('should load messages if the chat is opened', () => {
      renderUseChat(`/${region.code}/${languageCode}?chat=true`)
      expect(enabledOption()).toBe(true)
    })

    it('should load messages for an external chat id', () => {
      renderUseChat(`/${region.code}/${languageCode}?chatId=external-id`)
      expect(enabledOption()).toBe(true)
    })

    it('should not load messages if the chat is disabled for the region', () => {
      localStorage.setItem(chatIdKey(region.code), JSON.stringify('existing-id'))
      renderHook(() => useChat({ region: chatDisabledRegion, languageCode }), { wrapper: createWrapper() })
      expect(enabledOption()).toBe(false)
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

  describe('polling', () => {
    const refetch = jest.fn().mockResolvedValue({})

    beforeEach(() => {
      jest.useFakeTimers()
      localStorage.setItem(chatIdKey(region.code), JSON.stringify('existing-id'))
      jest.mocked(useQueryFromEndpoint).mockImplementation(
        () =>
          ({
            data: { messages: [{ userIsAuthor: true, content: 'my message' }], botTyping: false },
            error: null,
            isPending: false,
            refetch,
          }) as never,
      )
    })

    afterEach(() => {
      jest.useRealTimers()
      jest.restoreAllMocks()
      refetch.mockClear()
    })

    it('should poll messages without cancelling a pending retry', () => {
      renderUseChat()

      act(() => jest.advanceTimersByTime(30_000))

      expect(refetch).toHaveBeenCalledTimes(2)
      expect(refetch).toHaveBeenCalledWith({ cancelRefetch: false })
    })

    it('should pause polling while rate limited requests are waiting to be retried', () => {
      renderUseChat()
      jest.spyOn(Math, 'random').mockReturnValue(0)
      act(() => {
        rateLimitRetryOptions.retryDelay()
      })

      act(() => jest.advanceTimersByTime(59_000))
      expect(refetch).not.toHaveBeenCalled()

      act(() => jest.advanceTimersByTime(16_000))
      expect(refetch).toHaveBeenCalledTimes(2)
    })
  })
})
