import { act, fireEvent, waitFor } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'

import { CHAT_ROUTE, ChatRouteType } from 'shared'
import { CategoriesMapModelBuilder, ChatMessageModel, LanguageModelBuilder, RegionModelBuilder } from 'shared/api'

import useHeader from '../../hooks/useHeader'
import useLoadRegionContent from '../../hooks/useLoadRegionContent'
import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import Chat from '../Chat'

const { mocked } = jest

jest.mock('react-i18next')
jest.mock('@react-native-community/netinfo', () => ({ useNetInfo: jest.fn(() => ({ isConnected: true })) }))
jest.mock('../../utils/sentry', () => ({ captureError: jest.fn() }))
jest.mock('../../utils/helpers', () => ({ determineApiUrl: jest.fn(async () => 'https://api') }))
jest.mock('@react-native-community/netinfo')
jest.mock('../../hooks/useLoadRegionContent')
jest.mock('../../hooks/useHeader')

const mockLoadFromEndpoint: jest.Mock = jest.fn()
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  loadFromEndpoint: (...args: unknown[]) => mockLoadFromEndpoint(...args),
}))

let focusCallback: (() => void | (() => unknown)) | null = null
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: (callback: () => void | (() => unknown)) => {
    focusCallback = callback
  },
}))

jest.mock('../../components/WebView', () => {
  const { Text } = require('react-native')
  return ({ source }: { source: { uri: string } }) => <Text testID='webview'>{source.uri}</Text>
})

const regions = new RegionModelBuilder(3).build()
const region = regions[0]!
const languages = new LanguageModelBuilder(3).build()
const language = languages[0]!

const data = {
  regions,
  languages,
  region,
  language,
  categories: new CategoriesMapModelBuilder(region.code, language.code).build(),
  events: [],
  places: [],
  extra: [],
  news: [],
}

const buildMessage = (id: number, userIsAuthor: boolean) =>
  new ChatMessageModel({ id, content: '', created: DateTime.now(), userIsAuthor, automaticAnswer: false })

const route = { key: 'route-id-0', name: CHAT_ROUTE }
const navigation = createNavigationScreenPropMock<ChatRouteType>()

const renderChat = (
  chat: Record<string, { id: string; seenMessages: number }> = {},
  updateChatSettings: jest.Mock = jest.fn(),
) =>
  render(
    <TestingAppContext settings={{ chat }} updateChatSettings={updateChatSettings}>
      <Chat route={route} navigation={navigation} />
    </TestingAppContext>,
  )

type MenuItemProps = { onPress: () => void; disabled?: boolean; title: string; icon: string }

const lastMenuItems = (): ReactElement<MenuItemProps>[] => {
  const lastCall = mocked(useHeader).mock.lastCall
  if (!lastCall) {
    throw new Error('useHeader was not called')
  }
  const { menu } = lastCall[0]
  if (!menu) {
    throw new Error('useHeader was called without a menu element')
  }
  return (menu.props as { menuItems: ReactElement<MenuItemProps>[] }).menuItems
}

describe('Chat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    focusCallback = null
    mocked(useLoadRegionContent).mockImplementation(
      () =>
        ({
          refresh: jest.fn(),
          refreshNews: jest.fn(),
          loading: false,
          error: null,
          data,
        }) as never,
    )
  })

  it('shows a spinner and seeds default chat settings if none exist for the region', async () => {
    const updateChatSettings = jest.fn()
    const { getByLabelText, queryByTestId } = renderChat({}, updateChatSettings)

    expect(queryByTestId('webview')).toBeNull()
    expect(getByLabelText('loading')).toBeTruthy()
    await waitFor(() => expect(updateChatSettings).toHaveBeenCalledWith({ seenMessages: 0, id: expect.any(String) }))
  })

  it('renders the chat webview with a URL containing the existing chat id', () => {
    const { getByTestId } = renderChat({ augsburg: { id: 'existing-chat-id', seenMessages: 2 } })

    const uri = getByTestId('webview').props.children
    expect(uri).toContain('chat=true')
    expect(uri).toContain('chatId=existing-chat-id')
  })

  it('updates seenMessages on blur using the incoming message count', async () => {
    mockLoadFromEndpoint.mockResolvedValue({
      messages: [buildMessage(1, false), buildMessage(2, true), buildMessage(3, false)],
    })
    const updateChatSettings = jest.fn()

    renderChat({ augsburg: { id: 'existing-chat-id', seenMessages: 0 } }, updateChatSettings)

    expect(focusCallback).not.toBeNull()
    const focusReturn = focusCallback!()
    if (typeof focusReturn === 'function') {
      await focusReturn()
    }

    expect(updateChatSettings).toHaveBeenCalledWith({ seenMessages: 2 })
  })

  it('passes the available languages from the region content to the header', () => {
    renderChat({ augsburg: { id: 'existing-chat-id', seenMessages: 0 } })

    expect(useHeader).toHaveBeenCalledWith(
      expect.objectContaining({ availableLanguages: languages.map(it => it.code) }),
    )
  })

  it('shows the new chat confirmation dialog when the new chat menu item is pressed', () => {
    const { getByText, queryByText } = renderChat({ augsburg: { id: 'existing-chat-id', seenMessages: 0 } })

    expect(queryByText('newChatConfirmation')).toBeNull()

    act(() => {
      lastMenuItems()[0]!.props.onPress()
    })

    expect(getByText('newChatConfirmation')).toBeTruthy()
  })

  it('creates a fresh chat with a new id and zero seen messages when the confirmation is accepted', () => {
    const updateChatSettings = jest.fn()
    const { getAllByText } = renderChat({ augsburg: { id: 'old-chat-id', seenMessages: 5 } }, updateChatSettings)

    act(() => {
      lastMenuItems()[0]!.props.onPress()
    })

    const newChatLabels = getAllByText('newChat')
    fireEvent.press(newChatLabels[newChatLabels.length - 1]!)

    expect(updateChatSettings).toHaveBeenCalledWith({ seenMessages: 0, id: expect.any(String) })
    const newId = updateChatSettings.mock.calls.at(-1)![0].id
    expect(newId).not.toBe('old-chat-id')
  })

  it('does not change settings when the confirmation cancel button is pressed', () => {
    const updateChatSettings = jest.fn()
    const { getByText } = renderChat({ augsburg: { id: 'old-chat-id', seenMessages: 5 } }, updateChatSettings)

    act(() => {
      lastMenuItems()[0]!.props.onPress()
    })

    fireEvent.press(getByText('layout:cancel'))

    expect(updateChatSettings).not.toHaveBeenCalled()
  })
})
