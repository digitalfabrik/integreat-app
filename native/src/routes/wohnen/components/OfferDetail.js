// @flow

import React from 'react'
import { WohnenOfferModel, WohnenFormData, type AccommodationType } from 'api-client'
import styled from 'styled-components/native'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import Caption from '../../../modules/common/components/Caption'
import type { ThemeType } from 'build-configs/ThemeType'
import openExternalUrl from '../../../modules/common/openExternalUrl'

export const formatPrice = (price: number): string => {
  return (price % 1 === 0) ? `${price}` : `${price.toFixed(2)}`
}

const formatMonthlyPrice = (price: number): string => (price === 0) ? 'Keine' : `${formatPrice(price)} € monatlich`

type PropsType = {|
  offer: WohnenOfferModel,
  t: TFunction,
  theme: ThemeType
|}

const Header = styled.Text`
  padding: 15px 5px 5px;
  font-weight: 700;
`
const MarginalizedView = styled.View`
  margin: 0 10px;
`

const RowTitle = styled.Text`
  flex: 1;
`

const RowValue = styled.Text`
  flex: 1;
`

const Row = styled.View`
  display: flex;
  margin: 10px 0;
`

const ListElement = styled.View`
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
  margin-bottom: 10px;
`

class OfferDetail extends React.PureComponent<PropsType> {
  translate (type: 'runningServices' | 'additionalServices' | 'rooms', keys: Array<string>): Array<string> {
    return keys.map(key => this.props.t(`values.${type}.${key}`))
  }

  stringify (words: Array<string>): string {
    return words.join(', ')
  }

  openUrl = (url: string) => () => {
    openExternalUrl(url)
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
        <Caption title={accommodation.title} theme={this.props.theme} />

        <MarginalizedView>
          <ListElement theme={this.props.theme}>
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
        </MarginalizedView>

        <MarginalizedView>
          <ListElement>
            <Header>Mietkosten</Header>
          </ListElement>
          <Row>
            <RowTitle>Grundmiete:</RowTitle>
            <RowValue>{formatMonthlyPrice(costs.baseRent)}</RowValue>
          </Row>
          <Row>
            <RowTitle>Nebenkosten:</RowTitle>
            <RowValue>{formatMonthlyPrice(costs.runningCosts)}</RowValue>
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
            <RowValue>{formatMonthlyPrice(costs.additionalCosts)}</RowValue>
          </Row>
          <Row>
            <RowTitle>In Zusatzkosten enthalten:</RowTitle>
            <RowValue>{translateAdditionalServices(costs.ofAdditionalServices)}</RowValue>
          </Row>
          <Row>
            <RowTitle>Nicht in Zusatzkosten enthalten:</RowTitle>
            <RowValue> {translateAdditionalServices(costs.ofAdditionalServicesDiff)}</RowValue>
          </Row>
        </MarginalizedView>

        <MarginalizedView>
          <ListElement>
            <Header>Kontaktdaten</Header>
          </ListElement>
          <Row>
            <RowTitle>Name:</RowTitle>
            <RowValue>{landlord.firstName} {landlord.lastName}</RowValue>
          </Row>
          <Row>
            <RowTitle>Email:</RowTitle>
            <RowValue onPress={this.openUrl(`mailto:${offer.email}`)}>{offer.email}</RowValue>
          </Row>
          <Row>
            <RowTitle>Telefon: </RowTitle>
            <RowValue onPress={this.openUrl(`tel:${landlord.phone}`)}>{landlord.phone}</RowValue>
          </Row>
        </MarginalizedView>
      </>
    } else {
      throw new Error(`Failed to render form ${JSON.stringify(offer.formData)} because it is not supported!`)
    }
  }
}

export default withTranslation<PropsType>('wohnen')(OfferDetail)
