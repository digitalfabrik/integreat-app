import { render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import wrapWithTheme from '../../testing/wrapWithTheme'
import CityNotCooperatingFooter from '../CityNotCooperatingFooter'

describe('CityNotCooperatingFooter', () => {
  it('should render text and button', () => {
    const { getByText } = render(
      <BrowserRouter>
        <CityNotCooperatingFooter languageCode='de' />
      </BrowserRouter>,
      { wrapper: wrapWithTheme }
    )
    expect(getByText('cityNotFound')).toBeDefined()
    expect(getByText('clickHere')).toBeDefined()
  })
})
