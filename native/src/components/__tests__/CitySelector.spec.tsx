import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { CityModelBuilder } from 'api-client'

import render from '../../testing/render'
import CitySelector from '../CitySelector'

jest.mock('react-i18next')
jest.mock('../../components/NearbyCities', () => {
  const { Text } = require('react-native')
  return () => <Text>NearbyCities</Text>
})

describe('CitySelector', () => {
  const cities = new CityModelBuilder(5).build()
  const city = cities[0]!
  const navigateToDashboard = jest.fn()
  const t = jest.fn(key => key)

  it('should show only live cities', () => {
    const { getByText, queryByText } = render(
      <CitySelector navigateToDashboard={navigateToDashboard} t={t} cities={cities} />
    )

    expect(getByText('NearbyCities')).toBeTruthy()
    cities.filter(city => city.live).forEach(city => expect(getByText(city.name)).toBeTruthy())
    cities.filter(city => !city.live).forEach(city => expect(queryByText(city.name)).toBeFalsy())

    expect(navigateToDashboard).not.toHaveBeenCalled()
    fireEvent.press(getByText(city.name))
    expect(navigateToDashboard).toHaveBeenCalledTimes(1)
    expect(navigateToDashboard).toHaveBeenCalledWith(cities[0])
  })

  it('should show live cities matching filter text', () => {
    const { queryByText, getByText, getByPlaceholderText } = render(
      <CitySelector navigateToDashboard={navigateToDashboard} t={t} cities={cities} />
    )

    fireEvent.changeText(getByPlaceholderText('searchCity'), city.name.slice(5, 9))

    // Highlighter splits up the name in multiple parts
    expect(getByText(city.name.slice(0, 5), { exact: false })).toBeTruthy()
    expect(getByText(city.name.slice(5, 9).trim())).toBeTruthy()
    expect(getByText(city.name.slice(9), { exact: false })).toBeTruthy()
    cities.slice(1).forEach(city => expect(queryByText(city.name)).toBeFalsy())
  })

  it('should not show any city if filter text does not match', () => {
    const { queryByText, getByPlaceholderText } = render(
      <CitySelector navigateToDashboard={navigateToDashboard} t={t} cities={cities} />
    )

    fireEvent.changeText(getByPlaceholderText('searchCity'), 'Does not exist')

    cities.forEach(city => expect(queryByText(city.name)).toBeFalsy())
    expect(getByPlaceholderText('searchCity')).toBeTruthy()
  })

  it('should not show any city if filter text does not match a live city', () => {
    const { queryByText, getByPlaceholderText } = render(
      <CitySelector navigateToDashboard={navigateToDashboard} t={t} cities={cities} />
    )

    fireEvent.changeText(getByPlaceholderText('searchCity'), 'oldtown')

    cities.forEach(city => expect(queryByText(city.name)).toBeFalsy())
  })

  it('should show all non-live cities if filter text is "wirschaffendas"', () => {
    const { queryByText, getByText, getByPlaceholderText } = render(
      <CitySelector navigateToDashboard={navigateToDashboard} t={t} cities={cities} />
    )

    fireEvent.changeText(getByPlaceholderText('searchCity'), 'wirschaffendas')

    cities.filter(city => !city.live).forEach(city => expect(getByText(city.name)).toBeTruthy())
    cities.filter(city => city.live).forEach(city => expect(queryByText(city.name)).toBeFalsy())
  })
})
