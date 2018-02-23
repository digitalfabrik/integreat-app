import EndpointBuilder from '../EndpointBuilder'

describe('EndpointBuilder', () => {
  it('should have a default refetch logic which makes sense', () => {
    const endpoint = new EndpointBuilder(name)
      .withUrl('https://someurl')
      .withMapper((json) => json)
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
    const mapper = (json) => json
    const override = {test: 'random'}

    const endpoint = new EndpointBuilder(name)
      .withUrl(url)
      .withRefetchLogic(refetchLogic)
      .withMapper(mapper)
      .withResponseOverride(override)
      .withStateMapper().fromFunction((state) => ({}))
      .build()

    expect(endpoint.url).toBe(url)
    expect(endpoint.stateName).toBe(name)
    expect(endpoint.shouldRefetch).toBe(refetchLogic)
    expect(endpoint.mapResponse).toBe(mapper)
    expect(endpoint.responseOverride).toBe(override)
  })

  it('should throw errors if used incorrectly', () => {
    expect(() => new EndpointBuilder(undefined).build()).toThrow()

    const builder = new EndpointBuilder('endpoint')
    expect(() => builder.build()).toThrow()
    builder.withUrl('https://someurl')
    expect(() => builder.build()).toThrow()
    builder.withMapper((json) => json)
    expect(() => builder.build()).not.toThrow()
    builder.withRefetchLogic(null)
    expect(() => builder.build()).toThrow()
  })
})
