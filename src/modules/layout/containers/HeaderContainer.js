// @flow
import Header from '../components/Header'
import { connect } from 'react-redux'
import { withTheme } from 'styled-components'
import type { CategoryRouteStateType } from '../../app/StateType'
import { CategoryModel } from '@integreat-app/integreat-api-client'

const mapStateToProps = ({ categories }: CategoryModel) => categories

// $FlowFixMe
export default connect(mapStateToProps)(withTheme(Header))
