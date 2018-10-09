// @flow

import React from 'react'
import styled from 'styled-components'

type PropsType = {|
  baseRent: number,
  totalArea: number,
  totalRooms: number
|}

const Description = styled.div`
  display: flex;
  flex-direction: column;
`

const Price = styled.span`
  align-self: flex-end;
`

class OfferListItemInfo extends React.Component<PropsType> {
  render () {
    const {baseRent, totalArea, totalRooms} = this.props

    return (
      <Description>
        <div>{totalArea} m²</div>
        <div>{totalRooms} Zimmer</div>
        <Price>{baseRent} €</Price>
      </Description>
    )
  }
}

export default OfferListItemInfo
