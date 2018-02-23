import EndpointBuilder from '../EndpointBuilder'

describe('EndpointBuilder', () => {
  test('should have a default refetch logic which makes sense', () => {
    const endpoint = new EndpointBuilder(name)
      .withRouterToUrlMapper(() => 'https://someurl')
      .withMapper((json) => json)
      .build()

    // Not equal test
    expect(endpoint.shouldRefetch({}, {})).toBeFalsy()
    // Simple equal test
    expect(endpoint.shouldRefetch({a: 'b'}, {})).toBeTruthy()
    // Deep equal test
    expect(endpoint.shouldRefetch({a: {b: 'c'}}, {a: {b: null}})).toBeTruthy()
  })

  test('should produce the correct endpoint', () => {
    const url = 'https://someurl'
    const name = 'endpoint'
    const refetchLogic = () => false
    const mapper = (json) => json
    const override = {test: 'random'}

    const endpoint = new EndpointBuilder(name)
      .withRouterToUrlMapper(() => url)
      .withRefetchLogic(refetchLogic)
      .withMapper(mapper)
      .withResponseOverride(override)
      .build()

    expect(endpoint.mapRouterToUrl).toEqual(expect.any(Function))
    expect(endpoint.stateName).toBe(name)
    expect(endpoint.shouldRefetch).toBe(refetchLogic)
    expect(endpoint.mapResponse).toBe(mapper)
    expect(endpoint.responseOverride).toBe(override)
  })

  test('should throw errors if used incorrectly', () => {
    expect(() => new EndpointBuilder(undefined).build()).toThrow()

    const builder = new EndpointBuilder('endpoint')
    expect(() => builder.build()).toThrow()
    builder.withRouterToUrlMapper(() => 'https://someurl')
    expect(() => builder.build()).toThrow()
    builder.withMapper((json) => json)
    expect(() => builder.build()).not.toThrow()
    builder.withRefetchLogic(null)
    expect(() => builder.build()).toThrow()
  })
})
