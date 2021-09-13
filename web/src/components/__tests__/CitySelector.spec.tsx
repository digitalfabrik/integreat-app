import React from 'react'
import { ThemeProvider } from 'styled-components'

import { CityModelBuilder } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import CitySelector from '../CitySelector'

describe('CitySelector', () => {
  const cities = new CityModelBuilder(5).build()

  it('should show only live cities', () => {
    const { queryByLabelText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <CitySelector filterText='' language='de' cities={cities} />
      </ThemeProvider>
    )

    cities.filter(city => !city.live).forEach(city => expect(queryByLabelText(city.name)).toBeFalsy())
    cities.filter(city => city.live).forEach(city => expect(queryByLabelText(city.name)).toBeTruthy())
  })

  it('should show live cities matching filter text', () => {
    const { queryByLabelText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <CitySelector filterText={cities[0].name.slice(5, 9)} language='de' cities={cities} />
      </ThemeProvider>
    )

    expect(queryByLabelText(cities[0].name)).toBeTruthy()
    cities.slice(1).forEach(city => expect(queryByLabelText(city.name)).toBeFalsy())
  })

  it('should not show any city if filter text does not match', () => {
    const { queryByLabelText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <CitySelector filterText='Does not exist' language='de' cities={cities} />
      </ThemeProvider>
    )

    cities.forEach(city => expect(queryByLabelText(city.name)).toBeFalsy())
  })

  it('should not show any city if filter text does not match a live city', () => {
    const { queryByLabelText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <CitySelector filterText='oldtown' language='de' cities={cities} />
      </ThemeProvider>
    )

    cities.forEach(city => expect(queryByLabelText(city.name)).toBeFalsy())
  })

  it('should show all non-live cities if filter text is "wirschaffendas"', () => {
    const { queryByLabelText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <CitySelector filterText='wirschaffendas' language='de' cities={cities} />
      </ThemeProvider>
    )

    cities.filter(city => !city.live).forEach(city => expect(queryByLabelText(city.name)).toBeTruthy())
    cities.filter(city => city.live).forEach(city => expect(queryByLabelText(city.name)).toBeFalsy())
  })
})
