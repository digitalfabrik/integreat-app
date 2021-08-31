import React, { FunctionComponent } from 'react'
import { render } from '@testing-library/react'

import ListItem from '../ListItem'
import wrapWithTheme from '../../testing/wrapWithTheme'

describe('ListItemSpec', () => {
  const path = 'https://tuerantuer.org'

  it('should not render thumbnail in the ListItem', () => {
    const { getByRole } = render(<ListItem title='first Event' path={path} />, {
      wrapper: wrapWithTheme as FunctionComponent
    })
    expect(getByRole('link').closest('img')).not.toBeInTheDocument()
  })
  it('should render thumbnail in the ListItem', () => {
    const { getByRole } = render(<ListItem title='first Event' thumbnail='thumbnail' path={path} />, {
      wrapper: wrapWithTheme as FunctionComponent
    })
    expect(getByRole('img')).toBeInTheDocument()
  })
})
