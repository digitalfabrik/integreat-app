import React from 'react'
import { withFetcher } from '../withFetcher'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import EndpointBuilder from '../../EndpointBuilder'
import thunk from 'redux-thunk'
import StoreResponse from '../../StoreResponse'

describe('withFetcher', () => {
  const mockStore = configureMockStore([thunk])
  const endpoint = new EndpointBuilder('endpoint')
    .withUrl('https://someendpoint/{var1}/{var2}/api.json')
    .withMapper((json) => json)
    .withResponseOverride({test: 'random'})
    .build()

  test('should dipatch the correct actions whens fetch occurs', () => {
    const mockRequestAction = jest.fn().mockReturnValue(new StoreResponse(false))

    const HOC = withFetcher(endpoint, true, true)
    const Hoced = HOC(() => <span>Text</span>)

    const urlParams = {param1: 'a'}
    const otherUrlParams = {param2: 'b'}

    const tree = shallow(<Hoced urlParams={urlParams} requestAction={mockRequestAction} classname={''}/>)
    const instance = tree.instance()

    expect(mockRequestAction).toBeCalledWith(urlParams)

    instance.fetch(otherUrlParams)

    expect(mockRequestAction).toBeCalledWith(otherUrlParams)
  })
})
