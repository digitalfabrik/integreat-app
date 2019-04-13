// @flow
import Header from '../components/Header'
import { connect } from 'react-redux'
import { withTheme } from 'styled-components'

const mapStateToProps = ({ categories }: CategoriesStateType) => categories

export default connect(mapStateToProps)(withTheme(Header))

