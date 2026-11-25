import React from 'react'

import render from '../../testing/render'
import Caption from '../Caption'

describe('Caption', () => {
  it('should render and display a Caption', async () => {
    const { getByText } = await render(<Caption title='This is a test title!' />)
    getByText('This is a test title!')
  })
})
