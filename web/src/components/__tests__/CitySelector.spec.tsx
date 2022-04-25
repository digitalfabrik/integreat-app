import { fireEvent, Matcher } from '@testing-library/react'
import React from 'react'

import { CityModelBuilder } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import CitySelector from '../CitySelector'

jest.mock('react-i18next')

describe('CitySelector', () => {
  const previousConfig = buildConfig()
  let config = previousConfig

  beforeAll(() => {
    config.featureFlags.developerFriendly = false
  })

  afterAll(() => {
    config = previousConfig
  })

  const cities = new CityModelBuilder(5).build()
  const city = cities[0]!

  const changeFilterText = (getByPlaceholderText: (id: Matcher) => HTMLElement, filterText: string) => {
    fireEvent.change(getByPlaceholderText('landing:searchCity'), {
      target: {
        value: filterText
      }
    })
  }

  it('should show only live cities', () => {
    const { queryByLabelText } = renderWithRouter(<CitySelector language='de' cities={cities} />, {
      wrapWithTheme: true
    })

    cities.filter(city => !city.live).forEach(city => expect(queryByLabelText(city.name)).toBeFalsy())
    cities.filter(city => city.live).forEach(city => expect(queryByLabelText(city.name)).toBeTruthy())
  })

  it('should show live cities matching filter text', () => {
    const { queryByLabelText, getByPlaceholderText } = renderWithRouter(
      <CitySelector language='de' cities={cities} />,
      { wrapWithTheme: true }
    )

    changeFilterText(getByPlaceholderText, city.name.slice(5, 9))

    expect(queryByLabelText(city.name)).toBeTruthy()
    cities.slice(1).forEach(city => expect(queryByLabelText(city.name)).toBeFalsy())
  })

  it('should not show any city if filter text does not match', () => {
    const { queryByLabelText, getByPlaceholderText } = renderWithRouter(
      <CitySelector language='de' cities={cities} />,
      { wrapWithTheme: true }
    )

    changeFilterText(getByPlaceholderText, 'Does not exist')

    cities.forEach(city => expect(queryByLabelText(city.name)).toBeFalsy())
    expect(getByPlaceholderText('landing:searchCity')).toBeTruthy()
  })

  it('should not show any city if filter text does not match a live city', () => {
    const { queryByLabelText, getByPlaceholderText } = renderWithRouter(
      <CitySelector language='de' cities={cities} />,
      {
        wrapWithTheme: true
      }
    )

    changeFilterText(getByPlaceholderText, 'oldtown')

    cities.forEach(city => expect(queryByLabelText(city.name)).toBeFalsy())
  })

  it('should show all non-live cities if filter text is "wirschaffendas"', () => {
    const { queryByLabelText, getByPlaceholderText } = renderWithRouter(
      <CitySelector language='de' cities={cities} />,
      { wrapWithTheme: true }
    )

    changeFilterText(getByPlaceholderText, 'wirschaffendas')

    cities.filter(city => !city.live).forEach(city => expect(queryByLabelText(city.name)).toBeTruthy())
    cities.filter(city => city.live).forEach(city => expect(queryByLabelText(city.name)).toBeFalsy())
  })
})
