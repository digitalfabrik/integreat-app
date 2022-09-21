import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import GeneralFooter from '../GeneralFooter'

describe('GeneralFooter', () => {
  it('should show links', () => {
    const { getByText } = renderWithRouterAndTheme(<GeneralFooter language='de' />)
    expect(getByText('imprintAndContact')).toBeDefined()
    expect(getByText('settings:about')).toBeDefined()
    expect(getByText('privacy')).toBeDefined()
  })
})
