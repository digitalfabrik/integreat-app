import type { CityContentStateType } from '../../app/StateType'
import { defaultCityContentState } from '../../app/StateType'
import morphContentLanguage from './morphContentLanguage'
import pushEvent from './pushEvent'
import pushNews from './pushNews'
import type { StoreActionType } from '../../app/StoreActionType'
import createCityContent from './createCityContent'
import { omit } from 'lodash'
import pushPoi from './pushPoi'
import pushCategory from './pushCategory'
import { CATEGORIES_ROUTE, EVENTS_ROUTE, NEWS_ROUTE, POIS_ROUTE } from 'api-client'
export default (
  state: CityContentStateType | null = defaultCityContentState,
  action: StoreActionType
): CityContentStateType | null => {
  if (action.type === 'FETCH_CATEGORY') {
    const { language, path, depth, key, city } = action.params
    const initializedState = state || createCityContent(city)
    const reuseOldContent = state && state.routeMapping[key] && state.routeMapping[key].routeType === CATEGORIES_ROUTE
    const oldContent = reuseOldContent ? state?.routeMapping[key] : {}
    return {
      ...initializedState,
      routeMapping: {
        ...initializedState.routeMapping,
        [key]: { ...oldContent, routeType: CATEGORIES_ROUTE, status: 'loading', language, depth, path, city }
      }
    }
  } else if (action.type === 'FETCH_EVENT') {
    const { language, path, key, city } = action.params
    const initializedState = state || createCityContent(city)
    const reuseOldContent = state && state.routeMapping[key] && state.routeMapping[key].routeType === EVENTS_ROUTE
    const oldContent = reuseOldContent ? state?.routeMapping[key] : {}
    return {
      ...initializedState,
      routeMapping: {
        ...initializedState.routeMapping,
        [key]: { ...oldContent, routeType: EVENTS_ROUTE, status: 'loading', language, city, path }
      }
    }
  } else if (action.type === 'FETCH_NEWS') {
    const { language, newsId, key, city, type } = action.params
    const initializedState = state || createCityContent(city)
    return {
      ...initializedState,
      routeMapping: {
        ...initializedState.routeMapping,
        [key]: {
          routeType: NEWS_ROUTE,
          status: 'loading',
          language,
          city,
          newsId,
          type
        }
      }
    }
  } else if (action.type === 'FETCH_MORE_NEWS') {
    const { language, newsId, key, city, type, page, previouslyFetchedNews } = action.params
    const initializedState = state || createCityContent(city)
    return {
      ...initializedState,
      routeMapping: {
        ...initializedState.routeMapping,
        [key]: {
          routeType: NEWS_ROUTE,
          status: 'loadingMore',
          models: previouslyFetchedNews,
          language,
          city,
          newsId,
          type,
          page
        }
      }
    }
  } else if (action.type === 'FETCH_POI') {
    const { language, path, key, city } = action.params
    const initializedState = state || createCityContent(city)
    return {
      ...initializedState,
      routeMapping: {
        ...initializedState.routeMapping,
        [key]: {
          routeType: POIS_ROUTE,
          status: 'loading',
          language,
          city,
          path
        }
      }
    }
  } else {
    if (state === null) {
      return null
    }

    switch (action.type) {
      case 'SWITCH_CONTENT_LANGUAGE':
        return {
          ...state,
          switchingLanguage: true,
          searchRoute: null,
          resourceCache:
            state.resourceCache.status !== 'error' ? { ...state.resourceCache, progress: 0 } : state.resourceCache
        }

      case 'SWITCH_CONTENT_LANGUAGE_FAILED':
        return { ...state, switchingLanguage: false }

      case 'PUSH_LANGUAGES':
        return {
          ...state,
          languages: {
            status: 'ready',
            models: action.params.languages
          }
        }

      case 'FETCH_LANGUAGES_FAILED':
        return {
          ...state,
          languages: {
            status: 'error',
            ...action.params
          }
        }

      case 'FETCH_RESOURCES_PROGRESS':
        return {
          ...state,
          resourceCache:
            state.resourceCache.status !== 'error'
              ? { ...state.resourceCache, progress: action.params.progress }
              : state.resourceCache
        }

      case 'PUSH_CATEGORY':
        return pushCategory(state, action)

      case 'PUSH_POI':
        return pushPoi(state, action)

      case 'PUSH_EVENT':
        return pushEvent(state, action)

      case 'PUSH_NEWS':
        return pushNews(state, action)

      case 'FETCH_NEWS_FAILED': {
        const { message, key, allAvailableLanguages, newsId, type, ...rest } = action.params
        return {
          ...state,
          routeMapping: {
            ...state.routeMapping,
            [key]: allAvailableLanguages
              ? {
                  routeType: NEWS_ROUTE,
                  status: 'languageNotAvailable',
                  type,
                  allAvailableLanguages,
                  ...rest
                }
              : {
                  routeType: NEWS_ROUTE,
                  status: 'error',
                  message,
                  newsId,
                  type,
                  ...rest
                }
          }
        }
      }

      case 'CLEAR_ROUTE': {
        const { key } = action.params
        return { ...state, routeMapping: omit(state.routeMapping, [key]) }
      }

      case 'MORPH_CONTENT_LANGUAGE':
        return morphContentLanguage(state, action)

      case 'FETCH_EVENT_FAILED': {
        const { message, key, allAvailableLanguages, path, ...rest } = action.params
        return {
          ...state,
          routeMapping: {
            ...state.routeMapping,
            [key]: allAvailableLanguages
              ? {
                  routeType: EVENTS_ROUTE,
                  status: 'languageNotAvailable',
                  allAvailableLanguages,
                  ...rest
                }
              : {
                  routeType: EVENTS_ROUTE,
                  status: 'error',
                  message,
                  path,
                  ...rest
                }
          }
        }
      }

      case 'FETCH_CATEGORY_FAILED': {
        const { message, code, key, allAvailableLanguages, path, ...rest } = action.params
        return {
          ...state,
          routeMapping: {
            ...state.routeMapping,
            [key]: allAvailableLanguages
              ? {
                  routeType: CATEGORIES_ROUTE,
                  status: 'languageNotAvailable',
                  allAvailableLanguages,
                  ...rest
                }
              : {
                  routeType: CATEGORIES_ROUTE,
                  status: 'error',
                  message,
                  code,
                  path,
                  ...rest
                }
          }
        }
      }

      case 'CLEAR_CITY':
      case 'CLEAR_RESOURCES_AND_CACHE':
        return null

      case 'FETCH_RESOURCES_FAILED': {
        const { message, code } = action.params
        return {
          ...state,
          resourceCache: {
            status: 'error',
            message,
            code
          }
        }
      }

      default:
        return state
    }
  }
}
