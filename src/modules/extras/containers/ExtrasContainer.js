// @flow

import { connect } from 'react-redux'
import Extras from '../components/Extras'
import { translate } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import { compose } from 'recompose'

const mapStateToProps = (state: StateType, ownProps) => {
  const language: string = state.language

  const targetCity: string = ownProps.navigation.getParam('city')

  const navigateToExtras = (path: string) => {
    const params = {path, city: targetCity}
    if (ownProps.navigation.push) {
      ownProps.navigation.push('Extras', params)
    }
  }

  return {
    city: targetCity,
    language: language,
    navigateToExtras: navigateToExtras
  }
}

export default compose(
  connect(mapStateToProps),
  translate('extras')
)(Extras)
