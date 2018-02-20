import { handleAction } from 'redux-actions'
import { setSprungbrettUrl } from '../actions/setSprungbrettUrl'

/**
 * The reducer to store the url for the sprungbrett extra
 */
export default handleAction(setSprungbrettUrl,
  (state, action) => action.payload, {}
)
