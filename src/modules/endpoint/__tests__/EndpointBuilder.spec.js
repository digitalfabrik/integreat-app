import EndpointBuilder from '../EndpointBuilder'

describe('EndpointBuilder', () => {
  it('should have a default refetch logic which makes sense', () => {
    const endpoint = new EndpointBuilder(name)
      .withStateToUrlMapper(() => 'https://someurl')
      .withMapper(json => json)
      .build()

    // Not equal test
    expect(endpoint.shouldRefetch({}, {})).toBeFalsy()
    // Simple equal test
    expect(endpoint.shouldRefetch({a: 'b'}, {})).toBeTruthy()
    // Deep equal test
    expect(endpoint.shouldRefetch({a: {b: 'c'}}, {a: {b: null}})).toBeTruthy()
  })

  it('should produce the correct endpoint', () => {
    const url = 'https://someurl'
    const name = 'endpoint'
    const refetchLogic = () => false
    const mapper = json => json
    const override = {test: 'random'}

    const endpoint = new EndpointBuilder(name)
      .withStateToUrlMapper(() => url)
      .withRefetchLogic(refetchLogic)
      .withMapper(mapper)
      .withResponseOverride(override)
      .build()

    expect(endpoint.mapStateToUrl).toEqual(expect.any(Function))
    expect(endpoint.stateName).toBe(name)
    expect(endpoint.shouldRefetch).toBe(refetchLogic)
    expect(endpoint.mapResponse).toBe(mapper)
    expect(endpoint.responseOverride).toBe(override)
  })

  it('should throw errors if used incorrectly', () => {
    expect(() => new EndpointBuilder(undefined).build()).toThrowErrorMatchingSnapshot()

    const builder = new EndpointBuilder('endpoint')
    expect(() => builder.build()).toThrowErrorMatchingSnapshot()
    builder.withStateToUrlMapper(() => 'https://someurl')
    expect(() => builder.build()).toThrowErrorMatchingSnapshot()
    builder.withMapper(json => json)
    expect(() => builder.build()).not.toThrow()
    builder.withRefetchLogic(null)
    expect(() => builder.build()).toThrowErrorMatchingSnapshot()
  })
})
