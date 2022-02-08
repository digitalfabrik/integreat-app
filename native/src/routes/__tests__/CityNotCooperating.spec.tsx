import Clipboard from '@react-native-clipboard/clipboard'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { template } from '../../constants/cityNotCooperatingTemplate'
import render from '../../testing/render'
import CityNotCooperating from '../CityNotCooperating'

jest.mock('react-i18next')
jest.mock('styled-components')
jest.mock('@react-native-clipboard/clipboard', () => ({
  ...jest.requireActual('@react-native-clipboard/clipboard'),
  setString: jest.fn()
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
    expect(queryByText('textCopied')).toBeNull()
  })

  it('should call setString and copy text on button click', () => {
    const { getByText, queryByText } = render(<CityNotCooperating />)
    expect(queryByText('textCopied')).toBeNull()
    const button = getByText('copyText')
    fireEvent.press(button)
    expect(getByText('textCopied')).toBeDefined()
    expect(queryByText('copyText')).toBeNull()
    expect(Clipboard.setString).toHaveBeenCalledWith(template)
  })
})
