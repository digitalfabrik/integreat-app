import React from 'react'
import CleanLink from '../CleanLink'
import { renderWithRouter } from '../../testing/render'
import { render } from '@testing-library/react'

describe('CleanLink', () => {
  const linkInternal = '/augsburg/de/willkommen/willkommen-in-augsburg'
  const externalLink = 'https://integreat.app/'

  it('should render CleanLink internal', () => {
    const { getByTestId } = renderWithRouter(<CleanLink to={linkInternal}>Test</CleanLink>)
    expect(getByTestId('internalLink')).toBeTruthy()
    expect(getByTestId('internalLink')).toHaveAttribute('href', linkInternal)
  })

  it('should render CleanLink external', () => {
    const { getByTestId } = render(<CleanLink to={externalLink}>Test</CleanLink>)
    expect(getByTestId('externalLink')).toBeTruthy()
    expect(getByTestId('externalLink')).toHaveAttribute('href', externalLink)
  })
})
