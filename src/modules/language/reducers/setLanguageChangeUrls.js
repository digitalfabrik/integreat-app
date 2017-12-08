import { handleAction } from 'redux-actions'
import { setLanguageChangeUrls } from '../actions/setLanguageChangeUrls'

/**
 * The reducer to store the urls for language change
 */
export default handleAction(setLanguageChangeUrls,
  (state, action) => action.payload, {}
)
