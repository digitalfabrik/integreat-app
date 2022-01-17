import { render, fireEvent } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { BrowserRouter, Router } from 'react-router-dom'

import { CITY_NOT_COOPERATING_ROUTE } from 'api-client/src'

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
    expect(getByText('cityNotCooperating')).toBeDefined()
    expect(getByText('cityNotCooperatingButton')).toBeDefined()
  })

  it('should navigate on button click', () => {
    const history = createMemoryHistory()
    const { getByText } = render(
      <Router history={history}>
        <CityNotCooperatingFooter languageCode='de' />
      </Router>,
      { wrapper: wrapWithTheme }
    )
    const button = getByText('cityNotCooperatingButton')
    fireEvent.click(button)
    expect(history.location.pathname).toEqual(`/${CITY_NOT_COOPERATING_ROUTE}/de`)
  })
})
