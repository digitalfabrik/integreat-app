// @flow

import type { StateType } from '../../app/StateType'
import compose from 'lodash/fp/compose'
import connect from 'react-redux/es/connect/connect'
import { translate } from 'react-i18next'
import WohnenExtra from '../components/WohnenExtra'

const mapStateTypeToProps = (state: StateType, ownProps) => {
  const language: string = state.language
  const targetCity: string = ownProps.navigation.getParam('city')
  const offerHash: string = ownProps.navigation.getParam('offerHash')

  const navigateToOffer = (offerHash: string) => {
    const params = {offerHash, city: targetCity}
    if (ownProps.navigation.push) {
      ownProps.navigation.push('WohnenExtra', params)
    }
  }

  return {
    city: targetCity,
    language: language,
    offerHash: offerHash,
    navigateToOffer: navigateToOffer
  }
}

export default compose(
  connect(mapStateTypeToProps),
  translate('wohnen')
)(WohnenExtra)
