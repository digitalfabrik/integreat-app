// @flow

import { type Dispatch } from 'redux'
import { connect } from 'react-redux'
import Navigator from '../components/Navigator'
import type { StoreActionType } from '../StoreActionType'

type DispatchPropsType = {|
  setContentLanguage: (language: string) => void,
  fetchCategory: (cityCode: string, language: string, key: string) => void,
  clearCategory: (key: string) => void,
  fetchCities: (forceRefresh: boolean) => void
|}

type PropsType = DispatchPropsType

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  setContentLanguage: (language: string) => {
    dispatch({
      type: 'SET_CONTENT_LANGUAGE',
      params: { contentLanguage: language }
    })
  },
  fetchCategory: (cityCode: string, language: string, key: string) => {
    const path = `/${cityCode}/${language}`

    dispatch({
      type: 'FETCH_CATEGORY',
      params: {
        city: cityCode,
        language,
        path,
        depth: 2,
        criterion: { forceUpdate: false, shouldRefreshResources: true },
        key
      }
    })
  },
  clearCategory: (key: string) => {
    dispatch({ type: 'CLEAR_CATEGORY', params: { key } })
  },
  fetchCities: (forceRefresh: boolean) => {
    dispatch({ type: 'FETCH_CITIES', params: { forceRefresh } })
  }
})

export default connect<PropsType, {||}, _, _, _, _>(undefined, mapDispatchToProps)(Navigator)
