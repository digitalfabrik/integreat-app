import { chipClasses } from '@mui/material/Chip'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import SkipToContent from '../SkipToContent'

describe('SkipToContent', () => {
  it('should render skip to content button', () => {
    const { getByText } = renderWithTheme(<SkipToContent />)

    expect(getByText('common:a11y.skipToContent')).toBeTruthy()
  })

  it('should use contrast text for the enter icon', () => {
    const { getByText } = renderWithTheme(<SkipToContent />)
    const chip = getByText('ENTER').closest(`.${chipClasses.root}`)
    const icon = chip?.querySelector(`.${chipClasses.icon}`)

    expect(icon).not.toBeNull()
    expect(getComputedStyle(icon!).color).toBe('rgb(255, 255, 255)')
  })
})
