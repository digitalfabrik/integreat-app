import Endpoint from '../Endpoint'
describe('Endpoint', () => {
  const defaultMapParamsToUrl = (params: { var1: string; var2: string }) =>
    `https://weird-endpoint/${params.var1}/${params.var2}/api.json`

  const defaultJsonMapper = (json: string) => json

  it('should have correct state name', () => {
    const endpoint = new Endpoint('endpoint', defaultMapParamsToUrl, null, defaultJsonMapper)
    expect(endpoint.stateName).toBe('endpoint')
  })
})
