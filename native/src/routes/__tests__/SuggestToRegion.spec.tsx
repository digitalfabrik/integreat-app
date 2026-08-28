import Clipboard from '@react-native-clipboard/clipboard'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import buildConfig from '../../constants/__mocks__/buildConfig'
import render from '../../testing/render'
import SuggestToRegion from '../SuggestToRegion'

jest.mock('styled-components')
jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}))
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('SuggestToRegion', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    const { getByText, queryByText } = render(<SuggestToRegion />)
    expect(getByText('suggestToRegion:callToAction')).toBeDefined()
    expect(getByText('suggestToRegion:explanation')).toBeDefined()
    expect(getByText('suggestToRegion:whatToDo')).toBeDefined()
    expect(getByText('suggestToRegion:findOutMail')).toBeDefined()
    expect(getByText('suggestToRegion:sendText')).toBeDefined()
    expect(getByText('suggestToRegion:copyText')).toBeDefined()
    expect(queryByText('common:copied')).toBeNull()
  })

  it('should call setString and copy text on button click', () => {
    const { getByText, queryByText } = render(<SuggestToRegion />)
    expect(queryByText('common:copied')).toBeNull()
    const button = getByText('suggestToRegion:copyText')
    fireEvent.press(button)
    expect(getByText('common:copied')).toBeDefined()
    expect(queryByText('suggestToRegion:copyText')).toBeNull()
    expect(Clipboard.setString).toHaveBeenCalledWith(buildConfig().featureFlags.suggestToRegion?.template)
  })
})
