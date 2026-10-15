import React from 'react'

import { renderWithTheme } from '../../testing/render'
import OpenSourceListItem from '../OpenSourceListItem'

const defaultProps = {
  name: 'react',
  version: '18.2.0',
  author: 'Meta Platforms, Inc.',
  license: 'MIT',
  url: 'https://github.com/facebook/react',
}

describe('OpenSourceItem', () => {
  it('should render name, author, version and license', () => {
    const { getByText } = renderWithTheme(<OpenSourceListItem {...defaultProps} />)
    expect(getByText('react')).toBeTruthy()
    expect(getByText('Meta Platforms, Inc.')).toBeTruthy()
    expect(getByText('about:openSources.licenses.version 18.2.0')).toBeTruthy()
    expect(getByText('about:openSources.licenses.license MIT')).toBeTruthy()
  })

  it('should render as a link when url is provided', () => {
    const { getByRole } = renderWithTheme(<OpenSourceListItem {...defaultProps} />)
    const link = getByRole('link')
    expect(link).toBeTruthy()
    expect(link).toHaveAttribute('href', defaultProps.url)
  })

  it('should not render a link when url is not provided', () => {
    const { queryByRole } = renderWithTheme(<OpenSourceListItem {...defaultProps} url={undefined} />)
    expect(queryByRole('link')).toBeNull()
  })

  it('should not render author when author is not provided', () => {
    const { queryByText } = renderWithTheme(<OpenSourceListItem {...defaultProps} author={undefined} />)
    expect(queryByText('Meta Platforms, Inc.')).toBeNull()
  })
})
