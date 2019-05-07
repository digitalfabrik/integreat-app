// @flow

import * as React from 'react'

import {
  WohnenOfferModel,
  ExtraModel,
  SprungbrettJobModel,
  Payload,
  createSprungbrettJobsEndpoint
} from '@integreat-app/integreat-api-client'
import OfferDetail from './OfferDetail'
import Caption from '../../../modules/common/components/Caption'
import OfferListItem from './OfferListItem'
import List from '../../../modules/common/components/List'
import type { TFunction } from 'react-i18next'
import { hashWohnenOffer } from '../../extras/hashWohnenOffer'
import Failure from '../../../modules/error/components/Failure'
import { WOHNEN_EXTRA } from '../../extras/constants'
import request from '../../../modules/endpoint/request'
import { ActivityIndicator } from '../../sprungbrett/containers/SprungbrettExtraContainer'
import SprungbrettExtra from '../../sprungbrett/containers/SprungbrettExtraContainer'

type PropsType = {|
  offers: Array<WohnenOfferModel>,
  offerHash?: WohnenOfferModel,
  extra: ExtraModel,
  navigateToOffer: (offerHash: string) => void,
  t: TFunction
|}

type PropsType = {|
  sprungbrettExtra: ?ExtraModel,
  t: TFunction
|}

type SprungbrettStateType = {|
  jobs: ?Array<SprungbrettJobModel>,
  error: ?Error
|}

// HINT: If you are copy-pasting this container think about generalizing this way of fetching
class WohnenExtraContainer extends React.Component<PropsType, SprungbrettStateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {jobs: null, error: null}
  }

  componentWillMount () {
    this.loadSprungbrett()
  }

  async loadSprungbrett () {
    const {sprungbrettExtra} = this.props

    if (!sprungbrettExtra) {
      this.setState(() => ({error: new Error('The Sprungbrett extra is not supported.'), jobs: null}))
      return
    }

    const payload: Payload<Array<ExtraModel>> = await request(createSprungbrettJobsEndpoint(sprungbrettExtra.path))

    if (payload.error) {
      this.setState(() => ({error: payload.error, jobs: null}))
      return
    }

    this.setState(() => ({error: null, jobs: payload.data}))
  }

  render () {
    const {sprungbrettExtra, t} = this.props
    const {jobs, error} = this.state

    if (error) {
      return error.message
    }

    if (!jobs) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return <SprungbrettExtra sprungbrettExtra={sprungbrettExtra} sprungbrettJobs={jobs} t={t} />
  }
}

class WohnenExtra extends React.Component<PropsType> {
  renderOfferListItem = (offer: WohnenOfferModel) => {
    const hashedOffer = hashWohnenOffer(offer)
    return (
      <OfferListItem key={hashedOffer}
                     offer={offer}
                     navigateToOffer={this.navigateToOffer(hashedOffer)} />)
  }

  navigateToOffer = (offerHash: string) => () => {
    this.props.navigateToOffer(offerHash)
  }

  render () {
    const {offers, extra, offerHash, t} = this.props
    const extra: ExtraModel | void = extras.find(extra => extra.alias === WOHNEN_EXTRA)

    if (!extra) {
      return <Failure error={new Error('The Wohnen extra is not supported.')} />
    }

    if (offerHash) {
      const offer = offers.find(_offer => hashWohnenOffer(_offer) === offerHash)

      if (!offer) {
        return <Failure error={new Error('Angebot nicht gefunden.')} />
      }

      return (
        <OfferDetail offer={offer} />
      )
    }

    return (
      <>
        <Caption title={extra.title} />
        <List noItemsMessage={t('noOffersAvailable')}
              items={offers}
              renderItem={this.renderOfferListItem} />
      </>
    )
  }
}

export default WohnenExtra
