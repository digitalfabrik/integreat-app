import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import ChatMenu from '../ChatMenu'

describe('ChatMenu', () => {
  const updateChatId = jest.fn()
  beforeEach(jest.clearAllMocks)

  it('should open menu on icon button click', () => {
    const { getByLabelText, getByText } = renderWithTheme(<ChatMenu chatId='123' resetChat={updateChatId} />)

    const menuButton = getByLabelText('chat:chatOptions')
    fireEvent.click(menuButton)

    expect(getByText('chat:newChat')).toBeTruthy()
  })

  it('should disable new chat button when chatId is null', () => {
    const { getByLabelText, getByText } = renderWithTheme(<ChatMenu chatId={null} resetChat={updateChatId} />)

    const menuButton = getByLabelText('chat:chatOptions')
    fireEvent.click(menuButton)

    expect(getByText('chat:newChat').closest('li')).toHaveClass('Mui-disabled')
  })

  it('should show confirmation dialog when new chat is clicked', () => {
    const { getByLabelText, getByText } = renderWithTheme(<ChatMenu chatId='123' resetChat={updateChatId} />)

    fireEvent.click(getByLabelText('chat:chatOptions'))
    fireEvent.click(getByText('chat:newChat'))

    expect(getByText('chat:newChatConfirmation')).toBeTruthy()
  })

  it('should close dialog on cancel', () => {
    const { getByLabelText, getByText, queryByText } = renderWithTheme(
      <ChatMenu chatId='123' resetChat={updateChatId} />,
    )

    fireEvent.click(getByLabelText('chat:chatOptions'))
    fireEvent.click(getByText('chat:newChat'))
    expect(queryByText('chat:newChatConfirmation')).toBeTruthy()

    fireEvent.click(getByText('layout:cancel'))
    expect(queryByText('chat:newChatConfirmation')).toBeFalsy()
    expect(updateChatId).not.toHaveBeenCalled()
  })

  it('should create new chat on confirm', () => {
    const { getByLabelText, getByText, getByRole, queryByText } = renderWithTheme(
      <ChatMenu chatId='123' resetChat={updateChatId} />,
    )

    fireEvent.click(getByLabelText('chat:chatOptions'))
    fireEvent.click(getByText('chat:newChat'))
    fireEvent.click(getByRole('button', { name: 'chat:newChat' }))

    expect(updateChatId).toHaveBeenCalled()
    expect(queryByText('chat:newChatConfirmation')).toBeFalsy()
  })
})
