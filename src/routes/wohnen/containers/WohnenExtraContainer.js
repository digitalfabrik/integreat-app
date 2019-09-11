// @flow

import * as React from 'react'
import { ActivityIndicator } from 'react-native'
import type { StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import { type TFunction, translate } from 'react-i18next'
import WohnenExtra from '../components/WohnenExtra'
import { createWohnenEndpoint, ExtraModel, Payload, WohnenOfferModel } from '@integreat-app/integreat-api-client'
import { WOHNEN_EXTRA, WOHNEN_ROUTE } from '../../extras/constants'
import { wohnenApiBaseUrl } from '../../../modules/endpoint/constants'
import Failure from '../../../modules/error/components/Failure'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { NavigationScreenProp } from 'react-navigation'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

type StatePropsType = {|
  city: string,
  extra: ?ExtraModel,
  language: string,
  offerHash: string,
  navigateToOffer: (offerHash: string) => void
|}

type PropsType = { ...OwnPropsType, ...StatePropsType }

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const city: string = ownProps.navigation.getParam('city')
  const extras: Array<ExtraModel> = ownProps.navigation.getParam('extras')
  const offerHash: string = ownProps.navigation.getParam('offerHash')

  const extra: ExtraModel | void = extras.find(extra => extra.alias === WOHNEN_EXTRA)

  const navigateToOffer = (offerHash: string) => {
    const params = { offerHash: offerHash, extras: extras }
    if (ownProps.navigation.push) {
      ownProps.navigation.push(WOHNEN_ROUTE, params)
    }
  }

  return {
    city,
    language: state.contentLanguage,
    offerHash,
    extra,
    navigateToOffer
  }
}

type WohnenPropsType = {|
  city: string,
  extra: ?ExtraModel,
  offerHash?: WohnenOfferModel,
  navigateToOffer: (offerHash: string) => void,
  theme: ThemeType,
  language: string,
  t: TFunction
|}

type SprungbrettStateType = {|
  offers: ?Array<WohnenOfferModel>,
  error: ?Error
|}

// HINT: If you are copy-pasting this container think about generalizing this way of fetching
class WohnenExtraContainer extends React.Component<WohnenPropsType, SprungbrettStateType> {
  constructor (props: WohnenPropsType) {
    super(props)
    this.state = { offers: null, error: null }
  }

  componentWillMount () {
    this.loadSprungbrett()
  }

  async loadSprungbrett () {
    const { extra } = this.props

    if (!extra) {
      this.setState(() => ({ error: new Error('The Wohnen extra is not supported.'), offers: null }))
      return
    }

    try {
      const payload: Payload<Array<ExtraModel>> = await createWohnenEndpoint(wohnenApiBaseUrl).request(
        { city: extra.postData.get('api-name') }
      )

      if (payload.error) {
        this.setState(() => ({ error: payload.error, offers: null }))
        return
      }

      this.setState(() => ({ error: null, offers: payload.data }))
    } catch (e) {
      this.setState(() => ({ error: e, offers: null }))
    }
  }

  render () {
    const { language, extra, offerHash, navigateToOffer, t, theme } = this.props
    const { offers, error } = this.state

    if (error) {
      return <Failure error={error} t={t} theme={theme} />
    }

    if (!offers) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return <WohnenExtra wohnenExtra={extra} offerHash={offerHash} navigateToOffer={navigateToOffer} offers={offers}
                        t={t} theme={theme} language={language} />
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  translate('wohnen')(
    withTheme()(
      WohnenExtraContainer
    )))
