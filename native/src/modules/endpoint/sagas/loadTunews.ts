import { createTunewsEndpoint, Payload, TunewsModel } from 'api-client'
import { call, CallEffect } from 'redux-saga/effects'
import { tunewsApiUrl } from '../constants'

function* loadTunews(
  city: string,
  language: string,
  page: number,
  count: number
): Generator<CallEffect, TunewsModel | undefined | null, Payload<TunewsModel>> {
  console.debug('Fetching tunews')
  const payload = (yield call(() =>
    createTunewsEndpoint(tunewsApiUrl).request({
      city,
      language,
      page,
      count
    })
  )) as Payload<TunewsModel>
  return payload.data
}

export default loadTunews
