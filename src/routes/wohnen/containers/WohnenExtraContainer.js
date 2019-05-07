// @flow

import type { StateType } from '../../../modules/app/StateType'
import compose from 'lodash/fp/compose'
import connect from 'react-redux/es/connect/connect'
import { translate } from 'react-i18next'
import WohnenExtra from '../components/WohnenExtra'
import moment from 'moment'
import { ExtraModel, WohnenFormData, WohnenOfferModel } from '@integreat-app/integreat-api-client'
import { WOHNEN_ROUTE } from '../../extras/constants'

const mapStateToProps = (state: StateType, ownProps) => {
  const extras: Array<ExtraModel> = ownProps.navigation.getParam('extras')
  const offerHash: string = ownProps.navigation.getParam('offerHash')

  const navigateToOffer = (offerHash: string) => {
    const params = {offerHash: offerHash, extras: extras}
    if (ownProps.navigation.push) {
      ownProps.navigation.push(WOHNEN_ROUTE, params)
    }
  }

  return {
    offerHash: offerHash,
    extras: extras,
    navigateToOffer: navigateToOffer
  }
}

export default compose(
  connect(mapStateToProps),
  translate('wohnen')
)(WohnenExtra)
