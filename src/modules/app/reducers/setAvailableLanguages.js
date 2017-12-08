import { handleAction } from 'redux-actions'
import { setAvailableLanguages } from '../actions/setAvailableLanguages'

/**
 * The reducer to store the ids of the available languages
 */
export default handleAction(setAvailableLanguages,
  (state, action) => action.payload, {}
)
