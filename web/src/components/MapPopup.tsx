import { Position } from 'geojson'
import React, { ReactElement, useEffect } from 'react'
import styled from 'styled-components'

import { GeoJsonPoiProperties, PoiModel } from 'api-client'

const Popup = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  bottom: 0px;
  margin: 0 10% 5% 10%;
  width: 80%;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`

const TextContainer= styled.div`
  padding: 10px;
`

const PopupTitle = styled.h2`
  font-size: ${props => props.theme.fonts.decorativeFontSize}
`

const PopupText = styled.p`
  font-size: ${props => props.theme.fonts.contentFontSize}
`

const PopupThumbnail = styled.img`
  height: 10vh;
  margin: 10px;
`


type MapPopupProps = {
  coordinates: Position
  properties: GeoJsonPoiProperties
}

const MapPopup: React.FC<MapPopupProps> = (props: MapPopupProps): ReactElement => {
  const { properties: { distance, location, thumbnail, title } } = props

  const address = location ? JSON.parse(location)._address : ''
  console.log(typeof location)

  return (
    <Popup>
      {thumbnail !== 'null' && <PopupThumbnail src={thumbnail}/>}
        <TextContainer>
          <PopupTitle>{title}</PopupTitle>
          <PopupText>Adresse: {address}</PopupText>
          {distance && <PopupText>Distance: {distance}</PopupText>}
        </TextContainer>
    </Popup>
  )
}

export default MapPopup
