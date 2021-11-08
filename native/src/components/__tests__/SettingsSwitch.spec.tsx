import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import buildConfig from '../../constants/buildConfig'
import SettingsSwitch from '../SettingsSwitch'

describe('SettingsSwitch', () => {
  const lightTheme = buildConfig().lightTheme
  const createTestSwitch = (onPressMock: jest.Mock<any, any>) => {
    const { getByA11yRole } = render(<SettingsSwitch theme={lightTheme} value={false} onPress={onPressMock} />)
    return getByA11yRole('switch')
  }

  it('should execute onPress when toggled', () => {
    const onPressMock = jest.fn()
    const button = createTestSwitch(onPressMock)
    expect(button.props.value).toBeFalsy()
    fireEvent(button, 'valueChange', true)
    expect(onPressMock).toBeCalled()
  })
})
