import { render } from '@testing-library/react-native'
import React from 'react'
import { Text, View } from 'react-native'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import { CityModelBuilder } from 'api-client'

import useCities from '../useCities'

const mockStore = configureMockStore()

describe('useCities', () => {
  const MockComponent = () => {
    const cities = useCities()
    return <View>{cities ? cities.map(({ name }) => <Text key={name}>{name}</Text>) : <Text>not ready</Text>}</View>
  }

  it('should return cities', () => {
    const cities = new CityModelBuilder(2).build()
    const state = {
      cities: {
        status: 'ready',
        models: cities,
      },
    }
    const store = mockStore(state)
    const { getByText } = render(
      <Provider store={store}>
        <MockComponent />
      </Provider>
    )

    cities.forEach(({ name }) => expect(getByText(name)).toBeTruthy())
  })

  it('should return null if cities are not ready', () => {
    const state = {
      cities: {
        status: 'loading',
      },
    }
    const store = mockStore(state)
    const { getByText } = render(
      <Provider store={store}>
        <MockComponent />
      </Provider>
    )

    expect(getByText('not ready')).toBeTruthy()
  })
})
