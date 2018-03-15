import { extrasFetcher, locationLayoutFetcher, sprungbrettFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/extras/:extraAlias?',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language, extraAlias} = state.location.payload
    const prev = state.location.prev
    await locationLayoutFetcher(dispatch, getState)

    let extras = state.extras
    if (!extras || prev.payload.city !== city || prev.payload.language !== language) {
      extras = await extrasFetcher(dispatch, {city, language})
    }

    if (extraAlias === 'sprungbrett') {
      const sprungbrettModel = extras.find(_extra => _extra.alias === extraAlias)
      if (sprungbrettModel) {
        if (!state.sprungbrett) {
          await sprungbrettFetcher(dispatch, {url: sprungbrettModel.path})
        }
      }
    }
  }
}

export default route
