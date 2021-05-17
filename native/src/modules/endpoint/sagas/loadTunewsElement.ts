import { createTunewsElementEndpoint, Payload, TunewsModel } from 'api-client'
import { call, CallEffect } from 'redux-saga/effects'
import { tunewsApiUrl } from '../constants'

function* loadTunewsElement(
  city: string,
  language: string,
  id: number
): Generator<CallEffect, TunewsModel[] | null | undefined, Payload<TunewsModel[]>> {
  console.debug('Fetching tunews element')
  const payload = (yield call(() =>
    createTunewsElementEndpoint(tunewsApiUrl).request({
      city,
      language,
      id
    })
  )) as Payload<TunewsModel[]>
  return payload.data
}

export default loadTunewsElement
