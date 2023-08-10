import Clipboard from '@react-native-clipboard/clipboard'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import buildConfig from '../../constants/__mocks__/buildConfig'
import render from '../../testing/render'
import CityNotCooperating from '../CityNotCooperating'

jest.mock('react-i18next')
jest.mock('styled-components')
jest.mock('@react-native-clipboard/clipboard', () => ({
  ...jest.requireActual('@react-native-clipboard/clipboard'),
  setString: jest.fn(),
}))
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('CityNotCooperating', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    const { getByText, queryByText } = render(<CityNotCooperating />)
    expect(getByText('callToAction')).toBeDefined()
    expect(getByText('explanation')).toBeDefined()
    expect(getByText('whatToDo')).toBeDefined()
    expect(getByText('findOutMail')).toBeDefined()
    expect(getByText('sendText')).toBeDefined()
    expect(getByText('copyText')).toBeDefined()
    expect(queryByText('common:copied')).toBeNull()
  })

  it('should call setString and copy text on button click', () => {
    const { getByText, queryByText } = render(<CityNotCooperating />)
    expect(queryByText('common:copied')).toBeNull()
    const button = getByText('copyText')
    fireEvent.press(button)
    expect(getByText('common:copied')).toBeDefined()
    expect(queryByText('copyText')).toBeNull()
    expect(Clipboard.setString).toHaveBeenCalledWith(buildConfig().featureFlags.cityNotCooperatingTemplate)
  })
})
