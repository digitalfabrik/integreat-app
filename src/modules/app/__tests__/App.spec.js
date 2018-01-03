import { shallow } from 'enzyme'
import App from '../containers/App'
import React from 'react'
import createReduxStore from '../createReduxStore'
import createHistory from '../createHistory'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore([thunk])()
jest.mock('../createReduxStore', () => jest.fn().mockImplementation(() => mockStore))

describe('App', () => {
  test('should match snapshot', () => {
    const component = shallow(<App />)
    expect(component).toMatchSnapshot()
  })

  test('should create correct store and pass it to Provider', () => {

    const app = shallow(<App />)

    expect(createReduxStore).toHaveBeenCalledWith(createHistory)
    expect(app.find(Provider).prop('store')).toEqual(mockStore)
  })
})
