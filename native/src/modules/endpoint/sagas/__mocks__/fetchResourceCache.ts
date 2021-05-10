import { DataContainer } from '../../DataContainer'
import { Saga } from 'redux-saga'
import { FetchMapType } from '../fetchResourceCache'
export default function* fetchResourceCache(
  city: string,
  language: string,
  fetchMap: FetchMapType,
  dataContainer: DataContainer
): Saga<void> {}
