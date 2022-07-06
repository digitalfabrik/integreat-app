import { StoreActionType } from '../StoreActionType'

// Necessary for reducers
// eslint-disable-next-line default-param-last
export default (state: string | null = null, action: StoreActionType): string | null => {
  switch (action.type) {
    case 'SET_RESOURCE_CACHE_URL':
      return action.params.url

    default:
      return state
  }
}
