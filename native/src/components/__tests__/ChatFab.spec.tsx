import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import { CHAT_ROUTE } from 'shared'
import { ChatMessageModel } from 'shared/api'
import { mockUseLoadFromEndpointWithData } from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import useNavigate from '../../hooks/useNavigate'
import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import ChatFab from '../ChatFab'

jest.mock('react-i18next')
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

  it('navigates to the chat route when pressed', () => {
    mockUseLoadFromEndpointWithData({ messages: [] })
    const { getByTestId } = renderChatFab()

    fireEvent.press(getByTestId('fab'))
    expect(navigation.navigate).toHaveBeenCalledWith(CHAT_ROUTE)
  })

  it('shows the number of unseen incoming messages in a badge', () => {
    mockUseLoadFromEndpointWithData({
      messages: [buildMessage(1, false), buildMessage(2, true), buildMessage(3, false), buildMessage(4, false)],
    })
    const { getByText } = renderChatFab({ id: 'chat-id', seenMessages: 1 })

    expect(getByText('2')).toBeTruthy()
  })

  it('hides the badge when there are no unseen incoming messages', () => {
    mockUseLoadFromEndpointWithData({
      messages: [buildMessage(1, true), buildMessage(2, false)],
    })
    const { queryByText } = renderChatFab({ id: 'chat-id', seenMessages: 1 })

    expect(queryByText('0')).toBeNull()
  })
})
