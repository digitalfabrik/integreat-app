import { createEventsEndpoint, EventModel } from 'api-client'

import { dataContainer } from '../utils/DefaultDataContainer'
import useLoadCityContent, { CityContentReturn } from './useLoadCityContent'

type UseLoadEventsProps = {
  cityCode: string
  languageCode: string
}

const useLoadEvents = (params: UseLoadEventsProps): CityContentReturn<{ events: EventModel[] }> =>
  useLoadCityContent({
    ...params,
    createEndpoint: createEventsEndpoint,
    map: data => ({ events: data }),
    isAvailable: dataContainer.eventsAvailable,
    getFromDataContainer: dataContainer.getEvents,
    setToDataContainer: dataContainer.setEvents,
  })

export default useLoadEvents
