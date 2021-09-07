import { fireEvent } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { CityModelBuilder } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import FilterableCitySelector from '../FilterableCitySelector'

describe('FilterableCitySelector', () => {
  const cities = new CityModelBuilder(5).build()

  it('should show only live cities', () => {
    const { queryByLabelText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FilterableCitySelector language='de' cities={cities} />
      </ThemeProvider>
    )

    cities.filter(city => !city.live).forEach(city => expect(queryByLabelText(city.name)).toBeFalsy())
    cities.filter(city => city.live).forEach(city => expect(queryByLabelText(city.name)).toBeTruthy())
  })

  it('should filter cities on new text entered', () => {
    const { queryByLabelText, getByText, getByPlaceholderText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FilterableCitySelector language='de' cities={cities} />
      </ThemeProvider>
    )

    fireEvent.change(getByPlaceholderText('searchCity'), {
      target: {
        value: cities[0].name.slice(2, 5)
      }
    })

    expect(getByText(cities[0].name.slice(2, 5))).toBeTruthy()
    expect(queryByLabelText(cities[0].name)).toBeTruthy()
    cities.slice(1).forEach(city => expect(queryByLabelText(city.name)).toBeFalsy())
  })
})
