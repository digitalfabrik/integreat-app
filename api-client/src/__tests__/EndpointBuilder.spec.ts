// @flow

import EndpointBuilder from '../EndpointBuilder'

describe('EndpointBuilder', () => {
  it('should produce the correct endpoint', () => {
    const url = 'https://someurl'
    const name = 'endpoint'
    const mapper = json => json
    const responseOverride = { test: 'random' }
    const errorOverride = new Error('Error No. 5')
    const mapParamsToUrl = () => url

    const endpoint = new EndpointBuilder(name)
      .withParamsToUrlMapper(mapParamsToUrl)
      .withMapper(mapper)
      .withResponseOverride(responseOverride)
      .withErrorOverride(errorOverride)
      .build()

    expect(endpoint.mapParamsToUrl).toBe(mapParamsToUrl)
    expect(endpoint.stateName).toBe(name)
    expect(endpoint.mapResponse).toBe(mapper)
    expect(endpoint.responseOverride).toBe(responseOverride)
    expect(endpoint.errorOverride).toBe(errorOverride)
  })

  it('should throw errors if used incorrectly', () => {
    const builder = new EndpointBuilder('endpoint')
    expect(() => builder.build()).toThrowErrorMatchingSnapshot()
    builder.withParamsToUrlMapper(() => 'https://someurl')
    expect(() => builder.build()).toThrowErrorMatchingSnapshot()
    builder.withMapper(json => json)
    expect(() => builder.build()).not.toThrow()
  })
})
