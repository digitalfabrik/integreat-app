import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { GeoJsonPoiProperties } from 'api-client'

import CleanLink from './CleanLink'

const Popup = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  bottom: 0;
  margin: 0 5% 5%;
  width: 90%;
  height: 12vh;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.backgroundColor};
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
  padding: 0 5px;
`

const Placeholder = styled.div`
  height: 10vh;
  width: 10vh;
  border-radius: 8px;
  margin: 0 5px;
  background-color: ${props => props.theme.colors.textDisabledColor};
`

type MapPopupProps = {
  properties: GeoJsonPoiProperties
}

const MapPopup: React.FC<MapPopupProps> = ({ properties }: MapPopupProps): ReactElement => {
  const { distance, address, thumbnail, title, path } = properties

  return (
    <CleanLink to={path}>
      <Popup>
        {thumbnail !== 'null' ? <PopupThumbnail src={thumbnail} alt='' /> : <Placeholder />}
        <TextContainer>
          <PopupTitle>{title}</PopupTitle>
          <PopupText>{address}</PopupText>
          <PopupText>{distance}</PopupText>
        </TextContainer>
      </Popup>
    </CleanLink>
  )
}

export default MapPopup
