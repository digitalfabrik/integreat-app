// @flow
import React from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { translate } from 'react-i18next'

import Header from '../components/Header'
import { withTheme } from 'styled-components/native'
import type { StateType } from '../../app/StateType'
import { availableLanguagesSelector } from '../../common/selectors/availableLanguagesSelector'

const mapStateToProps = (state: StateType, ownProps) => ({
  availableLanguages: availableLanguagesSelector(state, ownProps),
  routeMapping: state.cityContent.categoriesRouteMapping
})

const themed = withTheme(props => <Header {...props} />)
export default translate('header')(withNavigation(connect(mapStateToProps)(themed)))
