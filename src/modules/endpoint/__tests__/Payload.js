import Payload from '../Payload'

describe('Payload', () => {
  const data = {data: 'something'}
  const error = 'Something bad happened'
  const fetchUrl = 'https://weird-endpoint/api.json'
  const fetchDate = 0

  test('should construct data payload correctly', () => {
    const payload = new Payload(true, data, null, fetchUrl, fetchDate)

    expect(payload.isFetching).toBeTruthy()
    expect(payload.data).toEqual(data)
    expect(payload.error).toBe(null)
    expect(payload.requestUrl).toBe(fetchUrl)
    expect(payload.fetchDate).toBe(fetchDate)
    expect(payload.ready()).toBeTruthy()
  })

  test('should construct error payload correctly', () => {
    const payload = new Payload(true, null, error, fetchUrl, fetchDate)

    expect(payload.data).toBe(null)
    expect(payload.error).toBe(error)
    expect(payload.ready()).toBeFalsy()
  })

  test('should throw if error and data is supplied', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Payload(true, data, error, fetchUrl, fetchDate)
    }).toThrow()
  })

  test('should throw url is invalid', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Payload(true, data, null, 'Rambazamba!', fetchDate)
    }).toThrow()
  })
})
