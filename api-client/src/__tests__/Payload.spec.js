// @flow

import Payload from '../Payload'

describe('Payload', () => {
  const data = { data: 'something' }
  const error = new Error('Something bad happened')
  const fetchUrl = 'https://weird-endpoint/api.json'
  const fetchDate = 0

  it('should construct data payload correctly', () => {
    const payload = new Payload(true, fetchUrl, data, null, fetchDate)

    expect(payload.isFetching).toBeTruthy()
    expect(payload.data).toEqual(data)
    expect(payload.error).toBeNull()
    expect(payload.requestUrl).toBe(fetchUrl)
    expect(payload.fetchDate).toBe(fetchDate)
  })

  it('should construct error payload correctly', () => {
    const payload = new Payload(true, fetchUrl, null, error, fetchDate)

    expect(payload.data).toBeNull()
    expect(payload.error).toBe(error)
  })

  it('should throw if error and data is supplied', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Payload(true, fetchUrl, data, error, fetchDate)
    }).toThrowErrorMatchingSnapshot()
  })
})
