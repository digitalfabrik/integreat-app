import FeedbackEndpointBuilder from '../FeedbackEndpointBuilder'

describe('FeedbackEndpointBuilder', () => {
  const url = 'https://someurl'
  const name = 'endpoint'
  const mapParamsToBody = () => new FormData()
  const mapParamsToUrl = () => url

  it('should produce the correct endpoint', () => {
    const endpoint = new FeedbackEndpointBuilder(name)
      .withParamsToUrlMapper(mapParamsToUrl)
      .withParamsToBodyMapper(mapParamsToBody)
      .build()

    expect(endpoint.mapParamsToUrl).toBe(mapParamsToUrl)
    expect(endpoint.name).toBe(name)
    expect(endpoint.mapParamsToBody).toBe(mapParamsToBody)
  })

  it('should throw errors if used incorrectly', () => {
    expect(() => new FeedbackEndpointBuilder(undefined).build()).toThrowErrorMatchingSnapshot()

    const builder = new FeedbackEndpointBuilder(name)
    expect(() => builder.build()).toThrowErrorMatchingSnapshot()

    builder.withParamsToUrlMapper(() => mapParamsToBody())
    expect(() => builder.build()).toThrowErrorMatchingSnapshot()

    builder.withParamsToBodyMapper(mapParamsToUrl())
    expect(() => builder.build()).not.toThrow()
  })
})
