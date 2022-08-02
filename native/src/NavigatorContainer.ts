import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import Navigator from './Navigator'
import { StoreActionType } from './redux/StoreActionType'

type DispatchPropsType = {
  fetchCategory: (cityCode: string, language: string, key: string, forceUpdate: boolean) => void
  fetchCities: (forceRefresh: boolean) => void
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  fetchCategory: (cityCode: string, language: string, key: string, forceUpdate: boolean) => {
    const path = `/${cityCode}/${language}`
    dispatch({
      type: 'FETCH_CATEGORY',
      params: {
        city: cityCode,
        language,
        path,
        depth: 2,
        criterion: {
          forceUpdate,
          shouldRefreshResources: true,
        },
        key,
      },
    })
  },
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
