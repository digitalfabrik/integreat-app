import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { openStreeMapCopyright } from 'api-client/src'

import renderWithTheme from '../../testing/render'
import openExternalUrl from '../../utils/openExternalUrl'
import MapAttribution from '../MapsAttribution'

jest.mock('../../utils/openExternalUrl')

describe('MapAttribution', () => {
  it('should be displayed and opened', () => {
    const { getByText } = renderWithTheme(<MapAttribution />)
    fireEvent.press(getByText(openStreeMapCopyright.icon))
    fireEvent.press(getByText(openStreeMapCopyright.linkText))
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith(openStreeMapCopyright.url, expect.any(Function))
  })
})
