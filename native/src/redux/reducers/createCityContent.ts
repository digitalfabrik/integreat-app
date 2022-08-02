import { LanguageModel } from 'api-client'

import { CityContentStateType } from '../StateType'

const createCityContent = (city: string, languages?: Array<LanguageModel>): CityContentStateType => ({
  city,
  languages: !languages
    ? {
        status: 'loading',
      }
    : {
        status: 'ready',
        models: languages,
      },
  switchingLanguage: false,
  routeMapping: {},
  resourceCache: {
    status: 'ready',
    progress: 0,
    value: {},
  },
  searchRoute: null,
})

export default createCityContent
