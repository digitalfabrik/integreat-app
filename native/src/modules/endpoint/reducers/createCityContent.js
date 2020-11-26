// @flow

import type { CityContentStateType } from '../../app/StateType'
import { LanguageModel } from 'api-client'

const createCityContent = (city: string, languages: ?Array<LanguageModel>): CityContentStateType => {
  return {
    city,
    languages: !languages ? { status: 'loading' } : { status: 'ready', models: languages },
    switchingLanguage: false,
    categoriesRouteMapping: {},
    eventsRouteMapping: {},
    poisRouteMapping: {},
    newsRouteMapping: {},
    resourceCache: { status: 'ready', progress: 0, value: {} },
    searchRoute: null
  }
}

export default createCityContent
