// @flow
import Header from '../components/Header'
import { connect } from 'react-redux'
import { withTheme } from 'styled-components'
import type { CategoryRouteStateType } from '../app/StateType'

const mapStateToProps = ({ categories }: CategoryRouteStateType) => categories

export default connect(mapStateToProps)(withTheme(Header))
