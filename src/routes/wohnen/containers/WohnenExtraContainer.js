// @flow

import * as React from 'react'
import { ActivityIndicator } from 'react-native'
import type { StateType } from '../../../modules/app/StateType'
import compose from 'lodash/fp/compose'
import connect from 'react-redux/es/connect/connect'
import { type TFunction, translate } from 'react-i18next'
import WohnenExtra from '../components/WohnenExtra'
import {
  createWohnenEndpoint,
  ExtraModel,
  Payload,
  WohnenOfferModel
} from '@integreat-app/integreat-api-client'
import { WOHNEN_EXTRA, WOHNEN_ROUTE } from '../../extras/constants'
import request from '../../../modules/endpoint/request'
import { wohnenApiBaseUrl } from '../../../modules/endpoint/constants'
import Failure from '../../../modules/error/components/Failure'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { ThemeType } from '../../../modules/theme/constants/theme'

const mapStateToProps = (state: StateType, ownProps) => {
  const city: string = ownProps.navigation.getParam('city')
  const extras: Array<ExtraModel> = ownProps.navigation.getParam('extras')
  const offerHash: string = ownProps.navigation.getParam('offerHash')

  const extra: ExtraModel | void = extras.find(extra => extra.alias === WOHNEN_EXTRA)

  const navigateToOffer = (offerHash: string) => {
    const params = {offerHash: offerHash, extras: extras}
    if (ownProps.navigation.push) {
      ownProps.navigation.push(WOHNEN_ROUTE, params)
    }
  }

  return {
    city,
    offerHash: offerHash,
    extra: extra,
    navigateToOffer: navigateToOffer
  }
}

type PropsType = {|
  city: string,
  extra: ?ExtraModel,
  offerHash?: WohnenOfferModel,
  navigateToOffer: (offerHash: string) => void,
  theme: ThemeType,
  t: TFunction
|}

type SprungbrettStateType = {|
  offers: ?Array<WohnenOfferModel>,
  error: ?Error
|}

// HINT: If you are copy-pasting this container think about generalizing this way of fetching
class WohnenExtraContainer extends React.Component<PropsType, SprungbrettStateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {offers: null, error: null}
  }

  componentWillMount () {
    this.loadSprungbrett()
  }

  async loadSprungbrett () {
    const {extra} = this.props

    if (!extra) {
      this.setState(() => ({error: new Error('The Wohnen extra is not supported.'), offers: null}))
      return
    }

    try {
      const payload: Payload<Array<ExtraModel>> = await request(
        createWohnenEndpoint(wohnenApiBaseUrl),
        {city: extra.postData.get('api-name')}
      )

      if (payload.error) {
        this.setState(() => ({error: payload.error, offers: null}))
        return
      }

      this.setState(() => ({error: null, offers: payload.data}))
    } catch (e) {
      this.setState(() => ({error: e, offers: null}))
    }
  }

  render () {
    const {extra, offerHash, navigateToOffer, t, theme} = this.props
    const {offers, error} = this.state

    if (error) {
      return <Failure error={error} />
    }

    if (!offers) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return <WohnenExtra wohnenExtra={extra} offerHash={offerHash} navigateToOffer={navigateToOffer} offers={offers}
                        t={t} theme={theme} />
  }
}

export default compose(
  connect(mapStateToProps),
  translate('wohnen'),
  withTheme()
)(WohnenExtraContainer)
