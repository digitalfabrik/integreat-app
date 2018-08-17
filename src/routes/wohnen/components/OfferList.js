// @flow

import * as React from 'react'
import OfferListItem from './OfferListItem'
import WohnenOfferModel from 'modules/endpoint/models/WohnenOfferModel'
import { getWohnenExtraPath } from '../../../modules/app/routes/wohnen'
import CleanLink from '../../../modules/common/components/CleanLink'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import { isEmpty } from 'lodash/lang'
import styled from 'styled-components'

type PropsType = {
  offers: Array<WohnenOfferModel>,
  city: string,
  language: string,
  hashFunction: WohnenOfferModel => string,
  t: TFunction
}

const Paragraph = styled.p`
  text-align: center;
  padding: 25px 0;
`

// fixme: OfferList is connected to redux state because of Link -> not a plain old component

export class OfferList extends React.Component<PropsType> {
  render () {
    const {offers, city, language, t} = this.props

    if (isEmpty(offers)) {
      return <Paragraph>{t('noOffersAvailable')}</Paragraph>
    }

    return offers.map(offer => {
      const hash = this.props.hashFunction(offer)
      const offerPath = getWohnenExtraPath(city, language, hash)
      return <CleanLink key={hash} to={offerPath}>
        <OfferListItem offer={offer} />
      </CleanLink>
    })
  }
}

export default translate('wohnen')(OfferList)
