import type { DataContainer } from '../../DataContainer'
import type { Saga } from 'redux-saga'
import type { FetchMapType } from '../fetchResourceCache'
export default function* fetchResourceCache(
  city: string,
  language: string,
  fetchMap: FetchMapType,
  dataContainer: DataContainer
): Saga<void> {}
