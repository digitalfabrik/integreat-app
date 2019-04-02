// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { PushEventActionType } from '../../app/StoreActionType'

const pushEvent = (state: CityContentStateType, action: PushEventActionType): CityContentStateType => {
  const {events, path, key, language, city, resourceCache, languages} = action.params

  if (!key) {
    throw new Error('You need to specify a key!')
  }

  return {
    ...state,
    language,
    city,
    languages,
    eventsRouteMapping: {
      ...state.eventsRouteMapping,
      [key]: {
        path,
        models: path ? [events.find(event => event.path === path)] : events
      }
    },
    resourceCache: {...state.resourceCache, ...resourceCache}
  }
}

export default pushEvent
