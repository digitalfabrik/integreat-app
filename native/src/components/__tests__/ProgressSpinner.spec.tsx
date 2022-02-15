import { render } from '@testing-library/react-native'
import React from 'react'

import ProgressSpinner from '../ProgressSpinner'

jest.mock('styled-components')

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
