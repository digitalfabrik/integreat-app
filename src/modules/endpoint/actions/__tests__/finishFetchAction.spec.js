import finishFetchAction, { finishFetchActionName } from '../finishFetchAction'
import Payload from '../../Payload'

describe('finishFetchAction', () => {
  it('should have the right action name', () => {
    expect(finishFetchActionName('endpoint')).toBe('FINISH_FETCH_ENDPOINT')
  })

  it('should create the right action', () => {
    const payload = new Payload(false, 'data', null, 'https://random_api.json')
    expect(finishFetchAction('endpoint', payload)).toEqual({type: finishFetchActionName('endpoint'), payload: payload})
  })
})
