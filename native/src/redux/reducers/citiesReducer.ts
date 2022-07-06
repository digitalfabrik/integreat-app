import { CitiesStateType, defaultCitiesState } from '../StateType'
import { StoreActionType } from '../StoreActionType'

// Necessary for reducers
// eslint-disable-next-line default-param-last
export default (state: CitiesStateType = defaultCitiesState, action: StoreActionType): CitiesStateType => {
  switch (action.type) {
    case 'FETCH_CITIES':
      return {
        status: 'loading'
      }

    case 'PUSH_CITIES':
      return {
        status: 'ready',
        models: action.params.cities
      }

    case 'FETCH_CITIES_FAILED':
      return {
        status: 'error',
        message: action.params.message,
        code: action.params.code
      }

    default:
      return state
  }
}
