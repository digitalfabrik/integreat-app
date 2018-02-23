import * as React from 'react'
import { shallow } from 'enzyme'
import EndpointProvider from '../EndpointProvider'
import EndpointBuilder from '../EndpointBuilder'

describe('EndpointProvider', () => {
  const endpoint = new EndpointBuilder('endpoint')
    .withUrl('https://weird-endpoint/api.json')
    .withMapper((json) => json)
    .withResponseOverride({})
    .build()

  test('should have correct child context', () => {
    expect(EndpointProvider.childContextTypes).toHaveProperty('getEndpoint')

    const provider = shallow(<EndpointProvider endpoints={[endpoint]}>
      <div />
    </EndpointProvider>).instance()

    const getEndpoint = provider.getChildContext()['getEndpoint']
    expect(getEndpoint(endpoint.stateName)).toBe(endpoint)
  })

  test('should need children', () => {
    expect(() => shallow(
      <EndpointProvider endpoints={[endpoint]} />)
    ).toThrow()
  })
})
