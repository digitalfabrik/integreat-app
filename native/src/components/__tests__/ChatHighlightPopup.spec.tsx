import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import TestingAppContext from '../../testing/TestingAppContext'
import render from '../../testing/render'
import ChatHighlightPopup from '../ChatHighlightPopup'

describe('ChatHighlightPopup', () => {
  const chatName = 'Frag Integreat'

  it('should render popup when not previously dismissed', () => {
    const { getByText } = render(
      <TestingAppContext>
        <ChatHighlightPopup chatName={chatName} />
      </TestingAppContext>,
    )

    expect(getByText('chat:welcome.title 👋')).toBeTruthy()
    expect(getByText('chat:welcome.description')).toBeTruthy()
  })

  it('should not render popup when previously dismissed', () => {
    const { queryByText } = render(
      <TestingAppContext settings={{ chatHighlightPopupDismissed: true }}>
        <ChatHighlightPopup chatName={chatName} />
      </TestingAppContext>,
    )

    expect(queryByText('chat:welcome.title 👋')).toBeFalsy()
    expect(queryByText('chat:welcome.description')).toBeFalsy()
  })

  it('should persist dismissal when close button is pressed', () => {
    const updateSettings = jest.fn()
    const { getByLabelText } = render(
      <TestingAppContext updateSettings={updateSettings}>
        <ChatHighlightPopup chatName={chatName} />
      </TestingAppContext>,
    )

    fireEvent.press(getByLabelText('common:actions.close'))

    expect(updateSettings).toHaveBeenCalledWith({ chatHighlightPopupDismissed: true })
  })
})
