import { useCallback } from 'react'

import { createEventsEndpoint, EventModel } from 'api-client'

import { dataContainer } from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'
import useLoadCityContent, { CityContentReturn } from './useLoadCityContent'

type UseLoadEventsProps = {
  cityCode: string
  languageCode: string
}

const useLoadEvents = ({ cityCode, languageCode }: UseLoadEventsProps): CityContentReturn<{ events: EventModel[] }> => {
  const load = useCallback(async () => {
    if (await dataContainer.eventsAvailable(cityCode, languageCode)) {
      return { events: await dataContainer.getEvents(cityCode, languageCode) }
    }

    const payload = await createEventsEndpoint(await determineApiUrl()).request({
      city: cityCode,
      language: languageCode,
    })
    if (payload.data) {
      await dataContainer.setEvents(cityCode, languageCode, payload.data)
    }
    return payload.data ? { events: payload.data } : null
  }, [cityCode, languageCode])

  return useLoadCityContent({ cityCode, load })
}

export default useLoadEvents
