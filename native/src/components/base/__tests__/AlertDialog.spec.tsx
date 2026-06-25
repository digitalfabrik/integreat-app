import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Button, Text } from 'react-native'

import render from '../../../testing/render'
import AlertDialog, { SimpleAlertDialog } from '../AlertDialog'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('AlertDialog', () => {
  it('renders the title, children and provided actions when visible', () => {
    const onAction = jest.fn()
    const { getByText } = render(
      <AlertDialog
        visible
        close={jest.fn()}
        title={<Text>dialog-title</Text>}
        actions={[<Button key='ok' title='confirm' onPress={onAction} />]}>
        <Text>dialog-body</Text>
      </AlertDialog>,
    )

    expect(getByText('dialog-title')).toBeTruthy()
    expect(getByText('dialog-body')).toBeTruthy()

    fireEvent.press(getByText('confirm'))
    expect(onAction).toHaveBeenCalled()
  })

  it('does not render the title or body when not visible', () => {
    const { queryByText } = render(
      <AlertDialog visible={false} close={jest.fn()} title={<Text>dialog-title</Text>} actions={[]}>
        <Text>dialog-body</Text>
      </AlertDialog>,
    )

    expect(queryByText('dialog-title')).toBeNull()
    expect(queryByText('dialog-body')).toBeNull()
  })
})

describe('SimpleAlertDialog', () => {
  it('renders a translated close action that calls close', () => {
    const close = jest.fn()
    const { getByText } = render(
      <SimpleAlertDialog visible close={close} title={<Text>simple-title</Text>}>
        <Text>simple-body</Text>
      </SimpleAlertDialog>,
    )

    expect(getByText('simple-title')).toBeTruthy()
    expect(getByText('simple-body')).toBeTruthy()
    fireEvent.press(getByText('close'))
    expect(close).toHaveBeenCalled()
  })
})
