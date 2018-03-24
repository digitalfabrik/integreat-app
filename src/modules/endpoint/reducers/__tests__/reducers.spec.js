import reducers from '../'
import startFetchAction from '../../actions/startFetchAction'
import Payload from '../../Payload'
import lolex from 'lolex'
import finishFetchAction from '../../actions/finishFetchAction'

describe('endpoint reducers', () => {
  let clock
  const mockedTime = 0

  beforeEach(() => {
    clock = lolex.install({now: mockedTime, toFake: []})
  })

  afterEach(() => {
    clock.uninstall()
  })

  it('should reduce cities fetch actions', () => {
    const payload = new Payload(false, 'data', null, null)
    expect(reducers.cities(undefined, startFetchAction('cities'))).toEqual(new Payload(true))
    expect(reducers.cities(undefined, finishFetchAction('cities', payload))).toEqual(payload)
  })

  it('should reduce languages fetch actions', () => {
    const payload = new Payload(false, 'data', null, null)
    expect(reducers.languages(undefined, startFetchAction('languages'))).toEqual(new Payload(true))
    expect(reducers.languages(undefined, finishFetchAction('languages', payload))).toEqual(payload)
  })

  it('should reduce disclaimer fetch actions', () => {
    const payload = new Payload(false, 'data', null, null)
    expect(reducers.disclaimer(undefined, startFetchAction('disclaimer'))).toEqual(new Payload(true))
    expect(reducers.disclaimer(undefined, finishFetchAction('disclaimer', payload))).toEqual(payload)
  })

  it('should reduce events fetch actions', () => {
    const payload = new Payload(false, 'data', null, null)
    expect(reducers.events(undefined, startFetchAction('events'))).toEqual(new Payload(true))
    expect(reducers.events(undefined, finishFetchAction('events', payload))).toEqual(payload)
  })

  it('should reduce extras fetch actions', () => {
    const payload = new Payload(false, 'data', null, null)
    expect(reducers.extras(undefined, startFetchAction('extras'))).toEqual(new Payload(true))
    expect(reducers.extras(undefined, finishFetchAction('extras', payload))).toEqual(payload)
  })

  it('should reduce categories fetch actions', () => {
    const payload = new Payload(false, 'data', null, null)
    expect(reducers.categories(undefined, startFetchAction('categories'))).toEqual(new Payload(true))
    expect(reducers.categories(undefined, finishFetchAction('categories', payload))).toEqual(payload)
  })

  it('should reduce sprungbrettJobs fetch actions', () => {
    const payload = new Payload(false, 'data', null, null)
    expect(reducers.sprungbrettJobs(undefined, startFetchAction('sprungbrettJobs'))).toEqual(new Payload(true))
    expect(reducers.sprungbrettJobs(undefined, finishFetchAction('sprungbrettJobs', payload))).toEqual(payload)
  })
})
