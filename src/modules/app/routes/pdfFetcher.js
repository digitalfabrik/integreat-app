import { citiesFetcher, categoriesFetcher, languagesFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/fetch-pdf/:fetchUrl+',
  fromPath: (segment: string, key: string): string => key === 'fetchUrl' ? `/${segment}` : segment,
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.location.payload

    if (!state.cities) {
      await citiesFetcher(dispatch, city)
    }

    if (!state.languages) {
      await languagesFetcher({city}, dispatch, language)
    }

    if (!state.categories) {
      await categoriesFetcher({city, language}, dispatch)
    }
  }
}
export default route
