import { render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import wrapWithTheme from '../../testing/wrapWithTheme'
import GeneralFooter from '../GeneralFooter'

describe('GeneralFooter', () => {
  it('should show links', () => {
    const { getByText } = render(
      <BrowserRouter>
        <GeneralFooter language='de' />
      </BrowserRouter>,
      { wrapper: wrapWithTheme }
    )
    expect(getByText('imprintAndContact')).toBeDefined()
    expect(getByText('settings:about')).toBeDefined()
    expect(getByText('privacy')).toBeDefined()
  })
})
