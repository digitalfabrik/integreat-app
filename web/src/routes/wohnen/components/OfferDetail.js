// @flow

import React from 'react'
import { WohnenOfferModel, WohnenFormData, type AccommodationType } from 'api-client'
import styled from 'styled-components'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import Caption from '../../../modules/common/components/Caption'

type PropsType = {|
  offer: WohnenOfferModel,
  t: TFunction
|}

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

const ListElement = styled.div`
  border-bottom: 2px solid ${props => props.theme.colors.themeColor};
  margin-bottom: 10px;
`

class OfferDetail extends React.PureComponent<PropsType> {
  translate (type: 'runningServices' | 'additionalServices' | 'rooms', keys: Array<string>): Array<string> {
    return keys.map(key => this.props.t(`values.${type}.${key}`))
  }

  stringify (words: Array<string>): string {
    return words.join(', ')
  }

  formatMonthlyPrice (price: number): string {
    if (price === 0) {
      return 'Keine'
    }

    return `${price} € monatlich`
  }

  render () {
    const offer = this.props.offer

    if (offer.formData instanceof WohnenFormData) {
      const accommodation: AccommodationType = offer.formData.accommodation
      const costs = offer.formData.costs
      const landlord = offer.formData.landlord

      const translateRunningServices = keys => this.stringify(this.translate('runningServices', keys))
      const translateAdditionalServices = keys => this.stringify(this.translate('additionalServices', keys))
      const translateRooms = keys => this.stringify(this.translate('rooms', keys))

      return <>
        <Caption title={accommodation.title} />

        <div>
          <ListElement>
            <Header>Mietobjekt</Header>
          </ListElement>
          <Row>
            <RowTitle>Gesamtfläche:</RowTitle>
            <RowValue>{accommodation.totalArea} qm</RowValue>
          </Row>
          <Row>
            <RowTitle>Zimmeranzahl:</RowTitle>
            <RowValue>{accommodation.totalRooms}</RowValue>
          </Row>
          <Row>
            <RowTitle>Einzugsdatum:</RowTitle>
            <RowValue>{accommodation.moveInDate.format('LL')}</RowValue>
          </Row>
          <Row>
            <RowTitle>Zimmer:</RowTitle>
            <RowValue>{translateRooms(accommodation.ofRooms)}</RowValue>
          </Row>
          <Row>
            <RowTitle>Standort:</RowTitle>
            <RowValue>{accommodation.location}</RowValue>
          </Row>
        </div>

        <div>
          <ListElement>
            <Header>Mietkosten</Header>
          </ListElement>
          <Row>
            <RowTitle>Grundmiete:</RowTitle>
            <RowValue>{this.formatMonthlyPrice(costs.baseRent)}</RowValue>
          </Row>
          <Row>
            <RowTitle>Nebenkosten:</RowTitle>
            <RowValue>{this.formatMonthlyPrice(costs.runningCosts)}</RowValue>
          </Row>
          <Row>
            <RowTitle>In Nebenkosten enthalten:</RowTitle>
            <RowValue>{translateRunningServices(costs.ofRunningServices)}</RowValue>
          </Row>
          <Row>
            <RowTitle>Nicht in Nebenkosten enthalten:</RowTitle>
            <RowValue>{translateRunningServices(costs.ofRunningServicesDiff)}</RowValue>
          </Row>
          <Row>
            <RowTitle>Warmwasser in Nebenkosten?</RowTitle>
            <RowValue>{costs.hotWaterInHeatingCosts ? 'Ja' : 'Nein'}</RowValue>
          </Row>
          <Row>
            <RowTitle>Zusatzkosten:</RowTitle>
            <RowValue>{this.formatMonthlyPrice(costs.additionalCosts)}</RowValue>
          </Row>
          <Row>
            <RowTitle>In Zusatzkosten enthalten:</RowTitle>
            <RowValue>{translateAdditionalServices(costs.ofAdditionalServices)}</RowValue>
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
            <RowValue>{landlord.firstName} {landlord.lastName}</RowValue>
          </Row>
          <Row>
            <RowTitle>Email:</RowTitle>
            <RowValue><a href={`mailto:${offer.email}`}>{offer.email}</a></RowValue>
          </Row>
          <Row>
            <RowTitle>Telefon: </RowTitle>
            <RowValue><a href={`tel:${landlord.phone}`}>{landlord.phone}</a></RowValue>
          </Row>
        </div>
      </>
    } else {
      throw new Error(`Failed to render form ${JSON.stringify(offer.formData)} because it is not supported!`)
    }
  }
}

export default withTranslation('wohnen')(OfferDetail)
