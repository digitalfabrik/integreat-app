// @flow

const fetchTuNewsRecducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case 'START_FETCH_TUNEWS_LIST':
      return {
        ...state,
        ...action.payload
      }

    case 'FINISH_FETCH_TUNEWS_LIST':
      return {
        ...state,
        ...action.payload,
        data: [...state.data, ...action.payload.data],
        hasMore: action.payload.data.length !== 0
      }

    default:
      return state
  }
}

export default fetchTuNewsRecducer
