import { GeoJsonProperties, Position } from 'geojson'
import React, { ReactElement } from 'react'
import { Popup } from 'react-map-gl'
import styled from 'styled-components'

const StyledPopup = styled(Popup)`
  width: 250px;
`

type MapPopupProps = {
  coordinates: Position
  properties: GeoJsonProperties
}

const MapPopup: React.FC<MapPopupProps> = (props: MapPopupProps): ReactElement => {
  const { coordinates, properties } = props
  return (
    <StyledPopup
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      closeButton={false}
      closeOnClick={false}
      anchor='bottom'>
      <div>
        <strong>{properties?.title}</strong>
      </div>
    </StyledPopup>
  )
}

export default MapPopup
