import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import ChatMenu from '../ChatMenu'

describe('ChatMenu', () => {
  const updateChatId = jest.fn()
  beforeEach(jest.clearAllMocks)

  it('should open menu on icon button click', () => {
    const { getByLabelText, getByText } = renderWithTheme(<ChatMenu chatId='123' resetChat={updateChatId} />)

    const menuButton = getByLabelText('common:labels.menu')
    fireEvent.click(menuButton)

    expect(getByText('chat:startNew.title')).toBeTruthy()
  })

  it('should disable new chat button when chatId is null', () => {
    const { getByLabelText, getByText } = renderWithTheme(<ChatMenu chatId={null} resetChat={updateChatId} />)

    const menuButton = getByLabelText('common:labels.menu')
    fireEvent.click(menuButton)

    expect(getByText('chat:startNew.title').closest('li')).toHaveClass('Mui-disabled')
  })

  it('should show confirmation dialog when new chat is clicked', () => {
    const { getByLabelText, getByText } = renderWithTheme(<ChatMenu chatId='123' resetChat={updateChatId} />)

    fireEvent.click(getByLabelText('common:labels.menu'))
    fireEvent.click(getByText('chat:startNew.title'))

    expect(getByText('chat:startNew.description')).toBeTruthy()
  })

  it('should close dialog on cancel', () => {
    const { getByLabelText, getByText, queryByText } = renderWithTheme(
      <ChatMenu chatId='123' resetChat={updateChatId} />,
    )

    fireEvent.click(getByLabelText('common:labels.menu'))
    fireEvent.click(getByText('chat:startNew.title'))
    expect(queryByText('chat:startNew.description')).toBeTruthy()

    fireEvent.click(getByText('common:actions.cancel'))
    expect(queryByText('chat:startNew.description')).toBeFalsy()
    expect(updateChatId).not.toHaveBeenCalled()
  })

  it('should create new chat on confirm', () => {
    const { getByLabelText, getByText, getByRole, queryByText } = renderWithTheme(
      <ChatMenu chatId='123' resetChat={updateChatId} />,
    )

    fireEvent.click(getByLabelText('common:labels.menu'))
    fireEvent.click(getByText('chat:startNew.title'))
    fireEvent.click(getByRole('button', { name: 'chat:startNew.title' }))

    expect(updateChatId).toHaveBeenCalled()
    expect(queryByText('chat:startNew.description')).toBeFalsy()
  })
})
