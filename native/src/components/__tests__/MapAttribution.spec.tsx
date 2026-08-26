import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { openStreeMapCopyright } from 'shared'

import renderWithTheme from '../../testing/render'
import MapAttribution from '../MapsAttribution'

const mockOpenExternalUrl = jest.fn()
jest.mock('../../utils/openExternalUrl', () => ({ __esModule: true, default: () => mockOpenExternalUrl }))

describe('MapAttribution', () => {
  it('should be displayed and opened', () => {
    const { getByText } = renderWithTheme(<MapAttribution accessible={false} />)
    fireEvent.press(getByText(openStreeMapCopyright.icon))
    fireEvent.press(getByText(openStreeMapCopyright.linkText))
    expect(mockOpenExternalUrl).toHaveBeenCalledTimes(1)
    expect(mockOpenExternalUrl).toHaveBeenCalledWith(openStreeMapCopyright.url)
  })
})
