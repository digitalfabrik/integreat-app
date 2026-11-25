import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { openStreetMapCopyright } from 'shared'

import renderWithTheme from '../../testing/render'
import MapAttribution from '../MapsAttribution'

const mockOpenExternalUrl = jest.fn()
jest.mock('../../utils/openExternalUrl', () => ({ __esModule: true, default: () => mockOpenExternalUrl }))

describe('MapAttribution', () => {
  it('should be displayed and opened', async () => {
    const { getByText } = await renderWithTheme(<MapAttribution accessible={false} />)
    await fireEvent.press(getByText(openStreetMapCopyright.icon))
    await fireEvent.press(getByText(openStreetMapCopyright.linkText))
    expect(mockOpenExternalUrl).toHaveBeenCalledTimes(1)
    expect(mockOpenExternalUrl).toHaveBeenCalledWith(openStreetMapCopyright.url)
  })
})
