// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import toggleDarkMode from 'modules/theme/actions/toggleDarkMode'
import { offlineActionTypes } from 'react-native-offline'

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  toggleTheme: () => dispatch(toggleDarkMode()),
  goOffline: () => dispatch({
    type: offlineActionTypes.CONNECTION_CHANGE,
    payload: false
  }),
  goOnline: () => dispatch({
    type: offlineActionTypes.CONNECTION_CHANGE,
    payload: true
  })
})
const mapStateToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
