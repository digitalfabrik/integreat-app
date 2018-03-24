import startFetchAction, { startFetchActionName } from '../startFetchAction'
import Payload from '../../Payload'

describe('startFetchAction', () => {
  it('should have the right action name', () => {
    expect(startFetchActionName('endpoint')).toBe('START_FETCH_ENDPOINT')
  })

  it('should create the right action', () => {
    expect(startFetchAction('endpoint')).toEqual({type: startFetchActionName('endpoint'), payload: new Payload(true)})
  })
})
