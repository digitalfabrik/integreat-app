import React from 'react'

import { renderWithTheme } from '../../testing/render'
import SkipToContent from '../SkipToContent'

jest.mock('react-i18next')

describe('SkipToContent', () => {
  it('should render skip to content button', () => {
    const { getByText } = renderWithTheme(<SkipToContent />)

    expect(getByText('layout:skipToContent')).toBeTruthy()
  })
})
