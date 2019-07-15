// @flow

import finishFetchAction, { finishFetchActionName } from '../finishFetchAction'
import lolex from 'lolex'
import { Payload } from '@integreat-app/integreat-api-client'

describe('finishFetchAction', () => {
  let clock
  const mockedTime = 0

  beforeEach(() => {
    clock = lolex.install({ now: mockedTime, toFake: [] })
  })

  afterEach(() => {
    clock.uninstall()
  })

  it('should have the right action name', () => {
    expect(finishFetchActionName('endpoint')).toBe('FINISH_FETCH_ENDPOINT')
  })

  it('should create the right action', () => {
    const payload = new Payload(false, 'https://random_api.json', 'data', null)
    expect(finishFetchAction('endpoint', payload)).toEqual({
      type: finishFetchActionName('endpoint'),
      payload: payload
    })
  })
})
