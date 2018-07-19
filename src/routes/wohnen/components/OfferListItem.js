// @flow

import React from 'react'
import style from './OfferListItem.css'
import WohnenOfferModel from '../../../modules/endpoint/models/WohnenOfferModel'

type PropsType = {
  offer: WohnenOfferModel
}

class OfferListItem extends React.Component<PropsType> {
  render () {
    const offer = this.props.offer

    // return <a href={offer.url} className={style.job} target='_blank' >
    return <div className={style.title}>{offer.email}</div>
    // <div className={style.description}>{offer.location}</div>
    // </a>
  }
}

export default OfferListItem
