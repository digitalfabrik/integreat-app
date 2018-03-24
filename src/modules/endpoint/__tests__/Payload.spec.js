import Payload from '../Payload'

describe('Payload', () => {
  const data = {data: 'something'}
  const error = 'Something bad happened'
  const fetchUrl = 'https://weird-endpoint/api.json'
  const fetchDate = 0

  it('should construct data payload correctly', () => {
    const payload = new Payload(true, data, null, fetchUrl, fetchDate)

    expect(payload.isFetching).toBeTruthy()
    expect(payload.data).toEqual(data)
    expect(payload.error).toBeNull()
    expect(payload.requestUrl).toBe(fetchUrl)
    expect(payload.fetchDate).toBe(fetchDate)
    expect(payload.ready()).toBeTruthy()
  })

  it('should construct error payload correctly', () => {
    const payload = new Payload(true, null, error, fetchUrl, fetchDate)

    expect(payload.data).toBeNull()
    expect(payload.error).toBe(error)
    expect(payload.ready()).toBeFalsy()
  })

  it('should throw if error and data is supplied', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Payload(true, data, error, fetchUrl, fetchDate)
    }).toThrowErrorMatchingSnapshot()
  })

  it('should throw if url is invalid', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Payload(true, data, null, 'Rambazamba!', fetchDate)
    }).toThrowErrorMatchingSnapshot()
  })
})
