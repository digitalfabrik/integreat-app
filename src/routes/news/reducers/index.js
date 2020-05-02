// @flow

export const fetchTuNewsRecducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case 'START_FETCH_TUNEWS_LIST':
      return {
        ...state,
        ...action.payload
      }
    case 'FINISH_FETCH_TUNEWS_LIST': {
      return {
        ...state,
        ...action.payload,
        data: [...state.data, ...action.payload.data],
        hasMore: action.payload.data.length !== 0
      }
    }
    case 'RESET_TU_NEWS': {
      return {
        ...state,
        ...action.payload,
        data: [],
        hasMore: true
      }
    }
    default:
      return state
  }
}

export default fetchTuNewsRecducer
