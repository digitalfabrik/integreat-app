import { shallow } from 'enzyme'
import App from '../App'
import React from 'react'
import createReduxStore from '../../createReduxStore'
import createHistory from '../../createHistory'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()
const mockedStore = mockStore()

jest.mock('../../createReduxStore', () => jest.fn().mockImplementation(() => mockedStore))

describe('App', () => {
  test('should render', () => {
    shallow(<App />)
  })

  test('should create correct store and pass it to Provider', () => {
    const app = shallow(<App />)

    expect(createReduxStore).toHaveBeenCalledWith(createHistory, {}, expect.any(Object))
    expect(app.find(Provider).prop('store')).toEqual(mockedStore)
  })
})
