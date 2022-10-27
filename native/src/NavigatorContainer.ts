import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import Navigator from './Navigator'
import { StoreActionType } from './redux/StoreActionType'

type DispatchProps = {
  fetchCities: (forceRefresh: boolean) => void
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchProps => ({
  fetchCities: (forceRefresh: boolean) => {
    dispatch({
      type: 'FETCH_CITIES',
      params: {
        forceRefresh,
      },
    })
  },
})

export default connect(undefined, mapDispatchToProps)(Navigator)
