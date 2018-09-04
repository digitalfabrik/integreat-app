// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import toggleDarkMode from 'modules/theme/actions/toggleDarkMode'

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  toggleTheme: action => dispatch(toggleDarkMode(action))
})
const mapStateToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
