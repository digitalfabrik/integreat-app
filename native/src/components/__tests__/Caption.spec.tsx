import { render } from '@testing-library/react-native'
import React from 'react'

import Caption from '../Caption'

describe('Caption', () => {
  it('should render and display a Caption', () => {
    const { getByText } = render(<Caption title='This is a test title!' />)
    getByText('This is a test title!')
  })
})
