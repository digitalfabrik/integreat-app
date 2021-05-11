import { Saga } from 'redux-saga'
import { PoiModel, createPOIsEndpoint, Payload } from 'api-client'
import { call } from 'redux-saga/effects'
import { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

class CallEffect {}

function* loadPois(
  city: string,
  language: string,
  poisEnabled: boolean,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Generator<CallEffect, Array<PoiModel> | null | undefined, boolean | PoiModel[] | string | Payload<Array<PoiModel>>> {
  const poisAvailable = (yield call(() => dataContainer.poisAvailable(city, language))) as boolean

  if (poisAvailable && !forceRefresh) {
    try {
      console.debug('Using cached pois')
      return (yield call(dataContainer.getPois, city, language)) as PoiModel[]
    } catch (e) {
      console.warn('An error occurred while loading pois from JSON', e)
    }
  }

  if (!poisEnabled) {
    console.debug('Pois disabled')
    yield call(dataContainer.setPois, city, language, [])
    return []
  }

  console.debug('Fetching pois')
  const apiUrl = (yield call(determineApiUrl)) as string
  const payload: Payload<Array<PoiModel>> = (yield call(() =>
    createPOIsEndpoint(apiUrl).request({
      city,
      language
    })
  )) as Payload<PoiModel[]>
  const pois = payload.data
  if (pois) {
    yield call(dataContainer.setPois, city, language, pois)
  }
  return pois
}

export default loadPois
