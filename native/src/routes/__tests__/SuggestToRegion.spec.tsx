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
    expect(getByText('suggestToRegion:title Integreat')).toBeDefined()
    expect(getByText('suggestToRegion:description')).toBeDefined()
    expect(getByText('suggestToRegion:whatToDo')).toBeDefined()
    expect(getByText('suggestToRegion:steps.getEmail')).toBeDefined()
    expect(getByText('suggestToRegion:steps.copyText')).toBeDefined()
    expect(getByText('common:actions.copy')).toBeDefined()
    expect(queryByText('common:state.copied')).toBeNull()
  })

  it('should call setString and copy text on button click', () => {
    const { getByText, queryByText } = render(<SuggestToRegion />)
    expect(queryByText('common:state.copied')).toBeNull()
    const button = getByText('common:actions.copy')
    fireEvent.press(button)
    expect(getByText('common:state.copied')).toBeDefined()
    expect(queryByText('common:actions.copy')).toBeNull()
    expect(Clipboard.setString).toHaveBeenCalledWith(buildConfig().featureFlags.suggestToRegion?.template)
  })
})
