import React from 'react'

import render from '../../testing/render'
import ProgressSpinner from '../ProgressSpinner'

jest.mock('styled-components')

describe('ProgressSpinner', () => {
  it('should display the loading text', () => {
    const { getByText } = render(<ProgressSpinner />)
    expect(getByText('common:loading')).toBeTruthy()
  })

  it('should label the loading text for screen readers', () => {
    const { getByText } = render(<ProgressSpinner />)
    expect(getByText('common:loading').props.accessibilityLabel).toBe('common:loading')
  })

  it('should expose a busy accessibility state', () => {
    const { getByText } = render(<ProgressSpinner />)
    expect(getByText('common:loading').props.accessibilityState).toEqual(expect.objectContaining({ busy: true }))
  })
  it('should announce the loading state to screen reader', () => {
    const { getByText } = render(<ProgressSpinner />)
    expect(getByText('common:loading').props.accessibilityLiveRegion).toBe('assertive')
  })
})
