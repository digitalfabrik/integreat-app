import { Position } from 'geojson'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { GeoJsonPoiProperties } from 'api-client'

const Popup = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  bottom: 0px;
  margin: 0 5% 5% 5%;
  width: 90%;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`

const TextContainer = styled.div`
  padding: 5px;
`

const PopupTitle = styled.h2`
  font-size: ${props => props.theme.fonts.decorativeFontSize};
`

const PopupText = styled.p`
  font-size: ${props => props.theme.fonts.contentFontSize};
`

const PopupThumbnail = styled.img`
  height: 10vh;
  border-radius: 8px;
`

type MapPopupProps = {
  coordinates: Position
  properties: GeoJsonPoiProperties
}

const MapPopup: React.FC<MapPopupProps> = (props: MapPopupProps): ReactElement => {
  const {
    properties: { distance, address, thumbnail, title }
  } = props

  return (
    <Popup>
      {thumbnail !== 'null' && <PopupThumbnail src={thumbnail} />}
      <TextContainer>
        <PopupTitle>{title}</PopupTitle>
        <PopupText>{address}</PopupText>
        <PopupText>{distance}</PopupText>
      </TextContainer>
    </Popup>
  )
}

export default MapPopup
