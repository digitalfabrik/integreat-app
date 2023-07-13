import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import ListItem from '../ListItem'

describe('ListItemSpec', () => {
  const path = 'https://tuerantuer.org'

  it('should not render thumbnail in the ListItem', () => {
    const { getByRole } = renderWithRouterAndTheme(<ListItem title='first Event' path={path} />)
    expect(getByRole('link').closest('img')).not.toBeInTheDocument()
  })

  it('should render thumbnail in the ListItem', () => {
    const { getByRole } = renderWithRouterAndTheme(<ListItem title='first Event' thumbnail='thumbnail' path={path} />)
    expect(getByRole('img')).toBeInTheDocument()
  })
})
