import React from 'react'

import { renderWithTheme } from '../../testing/render'
import SkipLinks from '../SkipLinks'

jest.mock('react-i18next')

describe('SkipLinks', () => {
  it('should render skip links', () => {
    const { getByText } = renderWithTheme(<SkipLinks />)

    expect(getByText('layout:skipToContent')).toBeTruthy()
  })
})
