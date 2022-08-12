import { render } from '@testing-library/react'
import React from 'react'

import wrapWithTheme from '../../testing/wrapWithTheme'
import ListItem from '../ListItem'

describe('ListItemSpec', () => {
  const path = 'https://tuerantuer.org'

  it('should not render thumbnail in the ListItem', () => {
    const { getByRole } = render(<ListItem title='first Event' path={path} />, {
      wrapper: wrapWithTheme,
    })
    expect(getByRole('link').closest('img')).not.toBeInTheDocument()
  })
  it('should render thumbnail in the ListItem', () => {
    const { getByRole } = render(<ListItem title='first Event' thumbnail='thumbnail' path={path} />, {
      wrapper: wrapWithTheme,
    })
    expect(getByRole('img')).toBeInTheDocument()
  })
})
