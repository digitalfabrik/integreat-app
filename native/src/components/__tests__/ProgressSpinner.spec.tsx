import React from 'react'

import render from '../../testing/render'
import ProgressSpinner from '../ProgressSpinner'

jest.mock('styled-components')
jest.mock('react-i18next')

describe('ProgressSpinner', () => {
  it('should display a progress text', () => {
    const { queryByText } = render(<ProgressSpinner progress={0.9} />)
    expect(queryByText(/loading/)).toBeTruthy()
  })
  it('should display a progress image', () => {
    const { getByTestId } = render(<ProgressSpinner progress={0.9} />)
    expect(getByTestId('loading-image')).toBeTruthy()
  })
})
