// @flow
import Header from '../components/Header'
// import { connect } from 'react-redux'
// import { withTheme } from 'styled-components'
// import { CategoryModel } from '@integreat-app/integreat-api-client'

// const mapStateToProps = ({ categories }: CategoryModel) => categories

// // $FlowFixMe
// export default connect(mapStateToProps)(withTheme(Header))
import { withTheme } from 'styled-components/native'
import type { StateType } from '../../app/StateType'
import { connect } from 'react-redux'
import React from 'react'
import { withNavigation } from 'react-navigation'
import { availableLanguagesSelector } from '../../common/selectors/availableLanguagesSelector'

const mapStateToProps = (state: StateType, ownProps) => ({
  availableLanguages: availableLanguagesSelector(state, ownProps),
  categories: state.categories
})

const themed = withTheme(props => <Header {...props} />)
export default withNavigation(connect(mapStateToProps)(themed))
