import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import openExternalUrl from '../../utils/openExternalUrl'
import Link from '../Link'

jest.mock('../../utils/openExternalUrl')

describe('Link', () => {
  it('should open url on press', () => {
    const { getByText } = render(<Link text='my custom text' url='https://example.com' />)
    fireEvent.press(getByText('my custom text'))
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith('https://example.com', expect.any(Function))
  })
})
