import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import { CHAT_ROUTE } from 'shared'
import { ChatMessageModel, createChatMessagesEndpoint, useLoadFromEndpoint } from 'shared/api'
import { mockUseLoadFromEndpointWithData } from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import useNavigate from '../../hooks/useNavigate'
import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import ChatFab from '../ChatFab'

jest.mock('../../hooks/useNavigate')

const buildMessage = (id: number, userIsAuthor: boolean) =>
  new ChatMessageModel({ id, content: `msg-${id}`, created: DateTime.now(), userIsAuthor, automaticAnswer: false })

const renderChatFab = (chatRegionSettings?: { id: string; seenMessages: number }) =>
  render(
    <TestingAppContext settings={{ chat: chatRegionSettings ? { augsburg: chatRegionSettings } : {} }}>
      <ChatFab />
    </TestingAppContext>,
  )

describe('ChatFab', () => {
  const { mocked } = jest
  const navigation = createNavigationPropMock()

  beforeEach(() => {
    jest.clearAllMocks()
    mocked(useNavigate).mockReturnValue({ navigation, navigateTo: jest.fn() })
  })

  it('navigates to the chat route when pressed', async () => {
    mockUseLoadFromEndpointWithData({ messages: [] })
    const { getByLabelText } = await renderChatFab()

    await fireEvent.press(getByLabelText('Frag Integreat'))
    expect(navigation.navigate).toHaveBeenCalledWith(CHAT_ROUTE)
  })

  it('does not load chat messages if the chat was never opened', async () => {
    mockUseLoadFromEndpointWithData({ messages: [buildMessage(1, false)] })
    const { queryByText } = await renderChatFab()

    expect(useLoadFromEndpoint).not.toHaveBeenCalled()
    expect(queryByText('1')).toBeNull()
  })

  it('loads chat messages with the stored chat id', async () => {
    mockUseLoadFromEndpointWithData({ messages: [] })
    await renderChatFab({ id: 'chat-id', seenMessages: 0 })

    expect(useLoadFromEndpoint).toHaveBeenCalledWith(
      createChatMessagesEndpoint,
      expect.anything(),
      expect.objectContaining({ chatId: 'chat-id' }),
    )
  })

  it('shows the number of unseen incoming messages in a badge', async () => {
    mockUseLoadFromEndpointWithData({
      messages: [buildMessage(1, false), buildMessage(2, true), buildMessage(3, false), buildMessage(4, false)],
    })
    const { getByText } = await renderChatFab({ id: 'chat-id', seenMessages: 1 })

    expect(getByText('2')).toBeTruthy()
  })

  it('hides the badge when there are no unseen incoming messages', async () => {
    mockUseLoadFromEndpointWithData({
      messages: [buildMessage(1, true), buildMessage(2, false)],
    })
    const { queryByText } = await renderChatFab({ id: 'chat-id', seenMessages: 1 })

    expect(queryByText('0')).toBeNull()
  })
})
