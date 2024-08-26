import { render } from '@testing-library/react'
import React from 'react'

import { renderWithRouter } from '../../testing/render'
import Link from '../base/Link'

describe('Link component', () => {
  it('renders an external link', () => {
    const { getByLabelText } = render(
      <Link to='https://example.com' ariaLabel='external link'>
        External Link
      </Link>,
    )
    const linkElement = getByLabelText('external link')
    expect(linkElement).toHaveAttribute('href', 'https://example.com')
    expect(linkElement).toHaveAttribute('aria-label', 'external link')
    expect(linkElement).not.toHaveAttribute('target', '_blank')
    expect(linkElement).not.toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders an internal link', () => {
    const { getByLabelText } = renderWithRouter(
      <Link to='internalRoute/test' ariaLabel='internal link'>
        Internal Link
      </Link>,
    )
    const linkElement = getByLabelText('internal link')
    expect(linkElement).toHaveAttribute('href', '/internalRoute/test')
    expect(linkElement).toHaveAttribute('aria-label', 'internal link')
  })

  it('opens link in a new tab', () => {
    const { getByLabelText } = renderWithRouter(
      <Link to='https://example.com' ariaLabel='external link' newTab>
        New Tab Link
      </Link>,
    )
    const linkElement = getByLabelText('external link')
    expect(linkElement).toHaveAttribute('target', '_blank')
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
