// @flow

import React from 'react'
import WohnenOfferModel from 'modules/endpoint/models/WohnenOfferModel'
import WohnenFormData from 'modules/endpoint/models/WohnenFormData'
import styled from 'styled-components'
import type { AccommodationType } from '../../../modules/endpoint/models/WohnenFormData'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import ListElement from '../../../modules/common/components/ListElement'

type PropsType = {
  offer: WohnenOfferModel<*>,
  t: TFunction
}

const Header = styled.div`
  padding: 15px 5px 5px;
  font-weight: 700;
`

const RowTitle = styled.div`
  flex: 50%;
`

const RowValue = styled.div`
  flex: 50%;
`

const Row = styled.div`
  display: flex;
  
  margin: 10px 0;
`

class OfferDetail extends React.Component<PropsType> {
  translate (type: 'runningServices' | 'additionalServices' | 'rooms', keys: Array<string>): Array<string> {
    return keys.map(key => this.props.t(`values.${type}.${key}`))
  }

  stringify (words: Array<string>): string {
    return words.join(', ')
  }

  render () {
    const offer = this.props.offer

    if (offer.formDataType === WohnenFormData) {
      const specificOffer: WohnenOfferModel<WohnenFormData> = offer
      const accommodation: AccommodationType = specificOffer.formData.accommodation
      const costs = specificOffer.formData.costs
      const landlord = offer.formData.landlord

      const translateRunningServices = keys => this.stringify(this.translate('runningServices', keys))
      const translateAdditionalServices = keys => this.stringify(this.translate('additionalServices', keys))
      const translateRooms = keys => this.stringify(this.translate('rooms', keys))

      return <React.Fragment>
        <div>
          <ListElement>
            <Header>Mietobjekt</Header>
          </ListElement>
          <Row>
            <RowTitle>Gesamtfläche:</RowTitle>
            <RowValue> {accommodation.totalArea} m²</RowValue>
          </Row>
          <Row>
            <RowTitle>Zimmeranzahl:</RowTitle>
            <RowValue> {accommodation.totalRooms}</RowValue>
          </Row>
          <Row>
            <RowTitle>Zimmer:</RowTitle>
            <RowValue> {translateRooms(accommodation.ofRooms)}</RowValue>
          </Row>
        </div>

        <div>
          <ListElement>
            <Header>Mietkosten</Header>
          </ListElement>
          <Row>
            <RowTitle>Grundmiete:</RowTitle>
            <RowValue> {costs.baseRent} € monatlich</RowValue>
          </Row>
          <Row>
            <RowTitle>Nebenkosten:</RowTitle>
            <RowValue> {costs.runningCosts} € monatlich</RowValue>
          </Row>
          <Row>
            <RowTitle>In Nebenkosten enthalten:</RowTitle>
            <RowValue> {translateRunningServices(costs.ofRunningServices)}</RowValue>
          </Row>
          <Row>
            <RowTitle>Nicht in Nebenkosten enthalten:</RowTitle>
            <RowValue> {translateRunningServices(costs.ofRunningServicesDiff)}</RowValue>
          </Row>
          <Row>
            <RowTitle>Warmwasser in Nebenkosten?</RowTitle>
            <RowValue> {costs.hotWaterInHeatingCosts ? 'Ja' : 'Nein'}</RowValue>
          </Row>
          <Row>
            <RowTitle>Zusatzkosten:</RowTitle>
            <RowValue> {costs.additionalCosts} € monatlich</RowValue>
          </Row>
          <Row>
            <RowTitle>In Zusatzkosten enthalten:</RowTitle>
            <RowValue> {translateAdditionalServices(costs.ofAdditionalServices)}</RowValue>
          </Row>
          <Row>
            <RowTitle>Nicht in Zusatzkosten enthalten:</RowTitle>
            <RowValue> {translateAdditionalServices(costs.ofAdditionalServicesDiff)}</RowValue>
          </Row>
        </div>

        <div>
          <ListElement>
            <Header>Kontaktdaten</Header>
          </ListElement>
          <Row>
            <RowTitle>Name:</RowTitle>
            <RowValue> {landlord.firstName} {landlord.lastName}</RowValue>
          </Row>
          <Row>
            <RowTitle>Email:</RowTitle>
            <RowValue> {offer.email}</RowValue>
          </Row>
          <Row>
            <RowTitle>Telefon: </RowTitle>
            <RowValue><a href={`tel:${landlord.phone}`}>{landlord.phone}</a></RowValue>
          </Row>
        </div>
      </React.Fragment>
    } else {
      throw new Error(`Failed to render form class ${offer.formDataType.name}!`)
    }
  }
}

export default translate('wohnen')(OfferDetail)
