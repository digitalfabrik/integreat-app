import { createTunewsEndpoint, Payload, TunewsModel } from 'api-client'
import { call } from 'redux-saga/effects'
import { tunewsApiUrl } from '../constants'
import { SagaIterator } from 'redux-saga'

function* loadTunews(city: string, language: string, page: number, count: number): SagaIterator<Array<TunewsModel>> {
  console.debug('Fetching tunews')
  const payload: Payload<TunewsModel[]> = yield call(() =>
    createTunewsEndpoint(tunewsApiUrl).request({
      city,
      language,
      page,
      count
    })
  )

  if (!payload.data) {
    throw new Error('Tunews not available')
  }

  return payload.data
}

export default loadTunews
