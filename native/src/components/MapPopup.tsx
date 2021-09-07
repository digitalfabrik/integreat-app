import type { Feature, Point } from 'geojson'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

type MapPopupProps = {
  feature: Feature<Point>
}

const Popup = styled.View`
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  bottom: 16px;
  width: 90%;
  height: 30%;
  background-color: ${props => props.theme.colors.backgroundColor};
  z-index: 10;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 5px #29000000;
`

const Title = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

const MapPopup: React.FC<MapPopupProps> = ({ feature }: MapPopupProps): ReactElement => {
  return <Popup>{feature.properties?.title && <Title>{feature.properties.title}</Title>}</Popup>
}

export default MapPopup
