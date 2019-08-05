// @flow

import type { CityContentStateType } from '../../app/StateType'
import { LanguageModel } from '@integreat-app/integreat-api-client'

const createCityContent = (city: string, languages: ?Array<LanguageModel>): CityContentStateType => {
  return {
    city,
    languages,
    switchingLanguage: false,
    categoriesRouteMapping: {},
    eventsRouteMapping: {},
    resourceCache: {},
    searchRoute: null
  }
}

export default createCityContent
