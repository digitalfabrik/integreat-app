// @flow

import * as React from 'react'

import type { StateType } from 'modules/app/StateType'
import { connect } from 'react-redux'
import WohnenOfferModel from '../../../modules/endpoint/models/WohnenOfferModel'

type PropsType = {
  wohnen: Array<WohnenOfferModel>
}

class WohnenExtra extends React.Component<PropsType> {
  render () {
    return this.props.wohnen.map(offer => offer.email)
  }
}
const mapStateTypeToProps = (state: StateType) => ({
  wohnen: state.wohnen.data
})

export default connect(mapStateTypeToProps)(WohnenExtra)
