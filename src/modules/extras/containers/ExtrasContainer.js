// @flow

import { connect } from 'react-redux'
import { Linking } from 'react-native'
import Extras from '../components/Extras'
import { translate } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import { compose } from 'recompose'

const mapStateToProps = (state: StateType, ownProps) => {
  const language: string = state.language

  const targetCity: string = ownProps.navigation.getParam('city')

  const navigateToExtras = (path: string, isExternalUrl: boolean) => {
    const params = {city: targetCity}
    if (isExternalUrl) {
      Linking.openURL(path)
    } else if (ownProps.navigation.push) {
      ownProps.navigation.push(path, params)
    }
  }

  return {
    city: targetCity,
    language: language,
    extras: extras,
    navigateToExtras: navigateToExtras
  }
}

export default compose(
  connect(mapStateToProps),
  translate('extras')
)(Extras)
