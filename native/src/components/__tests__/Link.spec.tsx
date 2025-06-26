import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import renderWithTheme from '../../testing/render'
import openExternalUrl from '../../utils/openExternalUrl'
import Link from '../Link'

jest.mock('../../utils/openExternalUrl')

describe('Link', () => {
  it('should open url on press', () => {
    const { getByText } = renderWithTheme(<Link url='https://example.com'>my custom text</Link>)
    fireEvent.press(getByText('my custom text'))
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith('https://example.com', expect.any(Function))
  })
})
