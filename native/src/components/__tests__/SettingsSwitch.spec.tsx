import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import SettingsSwitch from '../SettingsSwitch'

jest.mock('styled-components')
// https://github.com/callstack/react-native-testing-library/issues/329
jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
  const mockComponent = require('react-native/jest/mockComponent')
  return {
    default: mockComponent('react-native/Libraries/Components/Switch/Switch')
  }
})

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
