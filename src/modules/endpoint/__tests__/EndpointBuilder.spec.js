import EndpointBuilder from '../EndpointBuilder'

describe('EndpointBuilder', () => {
  it('should produce the correct endpoint', () => {
    const url = 'https://someurl'
    const name = 'endpoint'
    const mapper = json => json
    const responseOverride = {test: 'random'}
    const errorOverride = 'Error No. 5'

    const endpoint = new EndpointBuilder(name)
      .withStateToUrlMapper(() => url)
      .withMapper(mapper)
      .withResponseOverride(responseOverride)
      .withErrorOverride(errorOverride)
      .build()

    expect(endpoint.mapStateToUrl).toEqual(expect.any(Function))
    expect(endpoint.stateName).toBe(name)
    expect(endpoint.mapResponse).toBe(mapper)
    expect(endpoint.responseOverride).toBe(responseOverride)
    expect(endpoint.errorOverride).toBe(errorOverride)
  })

  it('should throw errors if used incorrectly', () => {
    expect(() => new EndpointBuilder(undefined).build()).toThrowErrorMatchingSnapshot()

    const builder = new EndpointBuilder('endpoint')
    expect(() => builder.build()).toThrowErrorMatchingSnapshot()
    builder.withStateToUrlMapper(() => 'https://someurl')
    expect(() => builder.build()).toThrowErrorMatchingSnapshot()
    builder.withMapper(json => json)
    expect(() => builder.build()).not.toThrow()
  })
})
