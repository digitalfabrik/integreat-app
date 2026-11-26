import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Button, Text } from 'react-native'

import render from '../../../testing/render'
import AlertDialog, { SimpleAlertDialog } from '../AlertDialog'

describe('AlertDialog', () => {
  it('renders the title, children and provided actions when visible', async () => {
    const onAction = jest.fn()
    const { getByText } = await render(
      <AlertDialog
        visible
        close={jest.fn()}
        title={<Text>dialog-title</Text>}
        actions={[<Button key='common:actions.ok' title='confirm' onPress={onAction} />]}>
        <Text>dialog-body</Text>
      </AlertDialog>,
    )

    expect(getByText('dialog-title')).toBeTruthy()
    expect(getByText('dialog-body')).toBeTruthy()

    await fireEvent.press(getByText('confirm'))
    expect(onAction).toHaveBeenCalled()
  })

  it('does not render the title or body when not visible', async () => {
    const { queryByText } = await render(
      <AlertDialog visible={false} close={jest.fn()} title={<Text>dialog-title</Text>} actions={[]}>
        <Text>dialog-body</Text>
      </AlertDialog>,
    )

    expect(queryByText('dialog-title')).toBeNull()
    expect(queryByText('dialog-body')).toBeNull()
  })
})

describe('SimpleAlertDialog', () => {
  it('renders a translated close action that calls close', async () => {
    const close = jest.fn()
    const { getByText } = await render(
      <SimpleAlertDialog visible close={close} title={<Text>simple-title</Text>}>
        <Text>simple-body</Text>
      </SimpleAlertDialog>,
    )

    expect(getByText('simple-title')).toBeTruthy()
    expect(getByText('simple-body')).toBeTruthy()
    await fireEvent.press(getByText('common:actions.close'))
    expect(close).toHaveBeenCalled()
  })
})
