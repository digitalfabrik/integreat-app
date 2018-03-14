import { extrasFetcher, languagesFetcher, citiesFetcher, sprungbrettFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/extras/:extraAlias?',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language, extraAlias} = state.location.payload

    if (!state.cities) {
      await citiesFetcher(dispatch, city)
    }

    if (!state.languages) {
      await languagesFetcher({city}, dispatch, language)
    }

    let extras
    if (!state.extras) {
      extras = await extrasFetcher({city, language}, dispatch)
    }
    if (extraAlias === 'sprungbrett') {
      const sprungbrettModel = extras.find(_extra => _extra.alias === extraAlias)
      if (sprungbrettModel) {
        if (!state.sprungbrett) {
          await sprungbrettFetcher({url: sprungbrettModel.path}, dispatch)
        }
      }
    }
  }
}

export default route
