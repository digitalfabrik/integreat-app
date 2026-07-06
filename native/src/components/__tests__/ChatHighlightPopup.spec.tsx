import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import TestingAppContext from '../../testing/TestingAppContext'
import render from '../../testing/render'
import ChatHighlightPopup from '../ChatHighlightPopup'

jest.mock('react-i18next')

describe('ChatHighlightPopup', () => {
  const chatName = 'Frag Integreat'

  it('should render popup when not previously dismissed', () => {
    const { getByText } = render(
      <TestingAppContext>
        <ChatHighlightPopup chatName={chatName} />
      </TestingAppContext>,
    )

    expect(getByText('welcomeGreeting 👋')).toBeTruthy()
    expect(getByText('chat:welcomeText')).toBeTruthy()
  })

  it('should not render popup when previously dismissed', () => {
    const { queryByText } = render(
      <TestingAppContext settings={{ chatHighlightPopupVisible: true }}>
        <ChatHighlightPopup chatName={chatName} />
      </TestingAppContext>,
    )

    expect(queryByText('welcomeGreeting 👋')).toBeFalsy()
    expect(queryByText('chat:welcomeText')).toBeFalsy()
  })

  it('should persist dismissal when close button is pressed', () => {
    const updateSettings = jest.fn()
    const { getByLabelText } = render(
      <TestingAppContext updateSettings={updateSettings}>
        <ChatHighlightPopup chatName={chatName} />
      </TestingAppContext>,
    )

    fireEvent.press(getByLabelText('common:close'))

    expect(updateSettings).toHaveBeenCalledWith({ chatHighlightPopupVisible: true })
  })
})
