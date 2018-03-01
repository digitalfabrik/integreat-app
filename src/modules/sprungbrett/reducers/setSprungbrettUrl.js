import { handleAction } from 'redux-actions'
import setSprungbrettUrl from '../actions/setSprungbrettUrl'

/**
 * The reducer to store the url for the sprungbrett extra, which is required
 * in order to have the url available for the sprungbrett fetcher
 */
export default handleAction(setSprungbrettUrl,
  (state, action) => action.payload, {}
)
