const reducer = (state = {}, action = '') =>
  (action.type === 'LOCATIONS_FETCHED' && action.payload) || state

export default reducer
