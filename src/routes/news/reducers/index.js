// @flow

export const fetchTunewsRecducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case 'START_FETCH_TUNEWSLIST':
      return {
        ...state,
        ...action.payload,
        isFetchingFirstTime: state.data.length === 0
      }
    case 'FINISH_FETCH_TUNEWSLIST': {
      return {
        ...state,
        ...action.payload,
        data: [...state.data, ...action.payload.data],
        hasMore: action.payload.data.length !== 0,
        isFetchingFirstTime: false
      }
    }
    case 'RESET_TU_NEWS': {
      return {
        ...state,
        ...action.payload,
        data: [],
        hasMore: true,
        isFetchingFirstTime: false
      }
    }
    default:
      return state
  }
}

export default fetchTunewsRecducer
