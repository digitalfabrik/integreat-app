import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import renderWithTheme from '../../testing/render'
import Link from '../Link'

const mockOpenExternalUrl = jest.fn()
jest.mock('../../utils/openExternalUrl', () => ({ __esModule: true, default: () => mockOpenExternalUrl }))

describe('Link', () => {
  it('should open url on press', () => {
    const { getByText } = renderWithTheme(<Link url='https://example.com'>my custom text</Link>)
    fireEvent.press(getByText('my custom text'))
    expect(mockOpenExternalUrl).toHaveBeenCalledTimes(1)
    expect(mockOpenExternalUrl).toHaveBeenCalledWith('https://example.com')
  })
})
