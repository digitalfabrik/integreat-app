import { handleAction } from 'redux-actions'
import { setUiDirectionAction } from '../actions/setUIDirection'

export default handleAction(setUiDirectionAction, (state, action) => action.payload, 'ltr')
