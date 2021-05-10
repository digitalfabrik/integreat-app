import { CityContentStateType } from '../../app/StateType'
import { LanguageModel } from 'api-client'

const createCityContent = (city: string, languages: Array<LanguageModel> | null | undefined): CityContentStateType => {
  return {
    city,
    languages: !languages
      ? {
          status: 'loading'
        }
      : {
          status: 'ready',
          models: languages
        },
    switchingLanguage: false,
    routeMapping: {},
    resourceCache: {
      status: 'ready',
      progress: 0,
      value: {}
    },
    searchRoute: null
  }
}

export default createCityContent
