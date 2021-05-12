import { StoreActionType } from '../../app/StoreActionType'

const toggleDarkModeReducer = (darkMode = false, action: StoreActionType) => {
  if (action.type === 'TOGGLE_DARK_MODE') {
    return !darkMode
  }

  return darkMode
}

export default toggleDarkModeReducer
