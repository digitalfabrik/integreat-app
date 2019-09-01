// @flow

import { type Dispatch } from 'redux'
import { connect } from 'react-redux'
import type { StoreActionType } from '../StoreActionType'
import Navigator from '../components/Navigator'

type DispatchPropsType = {|
  setContentLanguage: (language: string) => void,
  clearCategory: (key: string) => void,
  fetchDashboard: ({ city: string, language: string, key: string }) => void,
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
  fetchCities: (forceRefresh: boolean) => {
    dispatch({ type: 'FETCH_CITIES', params: { forceRefresh } })
  },
  clearCategory: (key: string) => {
    dispatch({ type: 'CLEAR_CATEGORY', params: { key } })
  },
  fetchDashboard: ({ city, language, key }: { city: string, language: string, key: string }) => {
    dispatch({
      type: 'FETCH_CATEGORY',
      params: {
        city: city,
        language: language,
        path: `/${city}/${language}`,
        depth: 2,
        key: key,
        criterion: { forceUpdate: false, shouldRefreshResources: true }
      }
    })
  }
})

export default connect<PropsType, {||}, _, _, _, _>(undefined, mapDispatchToProps)(Navigator)
