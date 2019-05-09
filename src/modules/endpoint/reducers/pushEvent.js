// @flow

import type { CityContentStateType, EventRouteStateType } from '../../app/StateType'
import type { PushEventActionType } from '../../app/StoreActionType'
import { EventModel } from '@integreat-app/integreat-api-client'

const pushEvent = (state: CityContentStateType, action: PushEventActionType): CityContentStateType => {
  const {events, path, key, language, city, resourceCache, languages, previousLanguage} = action.params

  if (!key) {
    throw new Error('You need to specify a key!')
  }

  const getEventRoute = (): EventRouteStateType => {
    if (!path) {
      return {
        path: null,
        models: events,
        allAvailableLanguages: new Map(languages.map(language => [language.code, language.code])),
        previousLanguage
      }
    }
    const event: EventModel = events.find(event => event.path === path)
    const allAvailableLanguages = new Map(event.availableLanguages)
    allAvailableLanguages.set(language, path)

    return {
      path,
      models: [event],
      allAvailableLanguages,
      previousLanguage
    }
  }

  return {
    ...state,
    language,
    city,
    languages,
    eventsRouteMapping: {
      ...state.eventsRouteMapping,
      [key]: getEventRoute()
    },
    resourceCache: {...state.resourceCache, ...resourceCache}
  }
}

export default pushEvent
