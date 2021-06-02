import { DataContainer } from '../../services/DataContainer'
import { FetchMapType } from '../fetchResourceCache'

export default function* fetchResourceCache(
  city: string,
  language: string,
  fetchMap: FetchMapType,
  dataContainer: DataContainer
): Generator {}
