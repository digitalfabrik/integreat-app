import createExtractAnswerEndpoint from '../createExtractAnswerEndpoint.ts'

describe('createExtractAnswerEndpoint', () => {
  const baseUrl = 'https://example.com'
  const params = {
    message: 'Where can I find General migration counseling?',
    languageCode: 'en',
    regionCode: 'muenchen',
  }
  const endpoint = createExtractAnswerEndpoint(baseUrl)

  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toBe(`${baseUrl}/chatanswers/extract_answer/`)
  })

  it('should map the params to the body', () => {
    expect(endpoint.mapParamsToBody?.(params)).toBe(
      JSON.stringify({ message: 'Where can I find General migration counseling?', language: 'en', region: 'muenchen' }),
    )
  })

  it('should map fetched data to the answer', () => {
    expect(endpoint.mapResponse({ status: 'success', answer: 'Answer' }, params)).toEqual({ answer: 'Answer' })
  })

  it('should throw if the backend reports an error', () => {
    expect(() => endpoint.mapResponse({ status: 'error', message: 'Service unavailable' }, params)).toThrow(
      'Service unavailable',
    )
  })
})
