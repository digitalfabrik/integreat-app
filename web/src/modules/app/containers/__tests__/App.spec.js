// @flow

import { shallow } from 'enzyme'
import App from '../App'
import React from 'react'
import createReduxStore from '../../createReduxStore'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()
const mockedStore = mockStore()

jest.mock('react-i18next')
jest.mock('../../createReduxStore', () => jest.fn().mockImplementation(() => mockedStore))

describe('App', () => {
  it('should render', () => {
    expect(shallow(<App />)).toMatchSnapshot()
  })

  it('should create correct store and pass it to Provider', () => {
    const app = shallow(<App />)

    expect(createReduxStore).toHaveBeenCalled()
    expect(app.find(Provider).prop('store')).toEqual(mockedStore)
  })
})
