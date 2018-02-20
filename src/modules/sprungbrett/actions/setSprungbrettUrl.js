import { createAction } from 'redux-actions'

export const setSprungbrettUrl = createAction('SET_SPRUNGBRETT_URL',
  (url) => ({url})
)
