// @flow

import { type Dispatch } from 'redux'
import { connect } from 'react-redux'
import Navigator from '../components/Navigator'

type DispatchPropsType = {|
  fetchCategory: (cityCode: string, language: string, key: string) => void,
  clearCategory: (key: string) => void
|}

type PropsType = DispatchPropsType

const mapDispatchToProps = (dispatch: Dispatch<*>): DispatchPropsType => ({
  fetchCategory: (cityCode: string, language: string, key: string) => {
    const path = `/${cityCode}/${language}`

    dispatch({
      type: 'FETCH_CATEGORY',
      params: {
        city: cityCode,
        language,
        path,
        depth: 2,
        forceUpdate: false,
        shouldRefreshResources: true,
        key
      }
    })
  },
  clearCategory: (key: string) => {
    dispatch({ type: 'CLEAR_CATEGORY', params: { key } })
  }
})

export default connect<PropsType, {||}, _, _, _, _>(undefined, mapDispatchToProps)(Navigator)
