// @flow

import Header from '../components/Header'
import { withTheme } from 'styled-components/native'
import type { StateType } from '../../app/StateType'
import { connect } from 'react-redux'
import React from 'react'
import { withNavigation } from 'react-navigation'

const mapStateToProps = (state: StateType, ownProps) => {
  const key: string = ownProps.navigation.getParam('key')
  // todo add availableLanguages for other routes
  const targetRoute = state.cityContent.categoriesRouteMapping[key]
  const model = targetRoute && targetRoute.root && targetRoute.models[targetRoute.root]
  const cityLanguages = state.cityContent.languages && state.cityContent.languages.map(languageModel => languageModel.code)
  const availableLanguages = model && !model.isRoot() ? Array.from(model.availableLanguages.keys()) : cityLanguages

  return {
    availableLanguages
  }
}

const themed = withTheme(props => <Header {...props} />)
export default withNavigation(connect(mapStateToProps)(themed))
