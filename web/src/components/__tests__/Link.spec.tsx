import { render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Link from '../base/Link'

describe('Link component', () => {
  it('renders an external link', () => {
    const { getByTestId } = render(
      <Link to='https://example.com' ariaLabel='external link'>
        External Link
      </Link>,
    )
    const linkElement = getByTestId('externalLink')
    expect(linkElement).toHaveAttribute('href', 'https://example.com')
    expect(linkElement).toHaveAttribute('aria-label', 'external link')
  })

  it('renders an internal link', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Link to='/internal' ariaLabel='internal link'>
          Internal Link
        </Link>
      </BrowserRouter>,
    )
    const linkElement = getByTestId('internalLink')
    expect(linkElement).toHaveAttribute('aria-label', 'internal link')
  })

  it('opens link in a new tab', () => {
    const { getByTestId } = render(
      <Link to='https://example.com' newTab>
        New Tab Link
      </Link>,
    )
    const linkElement = getByTestId('externalLink')
    expect(linkElement).toHaveAttribute('target', '_blank')
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
