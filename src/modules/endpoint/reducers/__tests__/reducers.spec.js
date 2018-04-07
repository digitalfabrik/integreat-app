import reducers, { startFetchReducer, finishFetchReducer } from '../'
import startFetchAction from '../../actions/startFetchAction'
import Payload from '../../Payload'
import lolex from 'lolex'
import finishFetchAction from '../../actions/finishFetchAction'

describe('endpoint reducers', () => {
  describe('start fetch reducer', () => {
    it('should return the action payload', () => {
      const action = startFetchAction('endpoint', 'https://url.com')
      expect(startFetchReducer({}, action)).toEqual(action.payload)
    })
  })

  describe('finish fetch reducer', () => {
    it('should return the action payload if the old payload was a fetching payload with the same url', () => {
      const oldPayload = new Payload(true, 'https://url.com')
      const payload = new Payload(false, 'https://url.com', {}, null)
      const action = finishFetchAction('endpoint', payload)
      expect(finishFetchReducer(oldPayload, action)).toEqual(action.payload)
    })

    it('should return the old payload if the old payload was not a fetching payload', () => {
      // this happens if two fetches are initiated and the first one finishes after the second one,
      // in which case we want to keep the data of the second fetch
      const oldPayload = new Payload(false, 'https://url.com', {}, null)
      const payload = new Payload(false, 'https://url.com', {}, null)
      const action = finishFetchAction('endpoint', payload)
      expect(finishFetchReducer(oldPayload, action)).toEqual(oldPayload)
    })

    it('should return the old payload if the url has changed', () => {
      // this happens if two fetches are initiated and the first one finishes after the second one was initiated,
      // in which case we don't want to store the data of the first fetch
      const oldPayload = new Payload(true, 'https://newUrl.com', {}, null)
      const payload = new Payload(false, 'https://url.com', {}, null)
      const action = finishFetchAction('endpoint', payload)
      expect(finishFetchReducer(oldPayload, action)).toEqual(oldPayload)
    })
  })

  describe('reducers', () => {
    let clock
    const mockedTime = 0

    beforeEach(() => {
      clock = lolex.install({now: mockedTime, toFake: []})
    })

    afterEach(() => {
      clock.uninstall()
    })

    it('should reduce cities fetch actions', () => {
      const payload = new Payload(false, null, 'data', null)
      expect(reducers.cities(undefined, startFetchAction('cities'))).toEqual(new Payload(true))
      expect(reducers.cities(new Payload(true), finishFetchAction('cities', payload))).toEqual(payload)
    })

    it('should reduce languages fetch actions', () => {
      const payload = new Payload(false, null, 'data', null)
      expect(reducers.languages(undefined, startFetchAction('languages'))).toEqual(new Payload(true))
      expect(reducers.languages(new Payload(true), finishFetchAction('languages', payload))).toEqual(payload)
    })

    it('should reduce disclaimer fetch actions', () => {
      const payload = new Payload(false, null, 'data', null)
      expect(reducers.disclaimer(undefined, startFetchAction('disclaimer'))).toEqual(new Payload(true))
      expect(reducers.disclaimer(new Payload(true), finishFetchAction('disclaimer', payload))).toEqual(payload)
    })

    it('should reduce events fetch actions', () => {
      const payload = new Payload(false, null, 'data', null)
      expect(reducers.events(undefined, startFetchAction('events'))).toEqual(new Payload(true))
      expect(reducers.events(new Payload(true), finishFetchAction('events', payload))).toEqual(payload)
    })

    it('should reduce extras fetch actions', () => {
      const payload = new Payload(false, null, 'data', null)
      expect(reducers.extras(undefined, startFetchAction('extras'))).toEqual(new Payload(true))
      expect(reducers.extras(new Payload(true), finishFetchAction('extras', payload))).toEqual(payload)
    })

    it('should reduce categories fetch actions', () => {
      const payload = new Payload(false, null, 'data', null)
      expect(reducers.categories(undefined, startFetchAction('categories'))).toEqual(new Payload(true))
      expect(reducers.categories(new Payload(true), finishFetchAction('categories', payload))).toEqual(payload)
    })

    it('should reduce sprungbrettJobs fetch actions', () => {
      const payload = new Payload(false, null, 'data', null)
      expect(reducers.sprungbrettJobs(undefined, startFetchAction('sprungbrettJobs'))).toEqual(new Payload(true))
      expect(reducers.sprungbrettJobs(new Payload(true), finishFetchAction('sprungbrettJobs', payload))).toEqual(payload)
    })
  })
})
