import type { Feature, Point } from 'geojson'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components'

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
  background-color: #ffffff;
  z-index: 10;
  border-radius: 10px;
  padding: 20px;
`

const Title = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

const MapPopup: React.FC<MapPopupProps> = ({ feature }: MapPopupProps): ReactElement => {
  const theme = useTheme()
  return <Popup>{feature?.properties?.title && <Title theme={theme}>{feature.properties.title}</Title>}</Popup>
}

export default MapPopup
