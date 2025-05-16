import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import render from '../../../testing/render'
import SettingsSwitch from '../SettingsSwitch'

jest.mock('styled-components')

describe('SettingsSwitch', () => {
  const createTestSwitch = (onPressMock: jest.Mock) => {
    const { getByRole } = render(<SettingsSwitch value={false} onPress={onPressMock} />)
    return getByRole('switch')
  }

  it('should execute onPress when toggled', () => {
    const onPressMock = jest.fn()
    const button = createTestSwitch(onPressMock)
    expect(button.props.value).toBeFalsy()
    fireEvent(button, 'valueChange', true)
    expect(onPressMock).toHaveBeenCalled()
  })
})
