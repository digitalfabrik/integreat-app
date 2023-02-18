import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import { openStreetMapCopyrightLink } from 'api-client/src'

import CleanLink from './CleanLink'

const Attribution = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 4px;
  margin-top: auto;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 3px 3px rgb(0 0 0 / 10%);
  color: rgba(0, 0, 0, 0.75);
`
const AttributionContainer = styled.div`
  display: flex;
  width: 100%;
  position: absolute;
  top: 0;
  justify-content: flex-end;
  padding: 8px 0;
`

const OpenStreetMapsLink = styled(CleanLink)`
  text-decoration: underline;
  color: ${props => props.theme.colors.tunewsThemeColor};
`

const Label = styled.span`
  padding: 0 4px;
  color: rgba(0, 0, 0, 0.75);
`

const Copyright = styled.span<{ minimized: boolean }>`
  padding: 0 4px;
  color: rgba(0, 0, 0, 0.75);
  font-size: ${props => (props.minimized ? '20px' : '12px')};
`

const MapAttribution = (): ReactElement => {
  const [minimized, setMinimized] = useState<boolean>(true)
  return (
    <AttributionContainer
      role='button'
      tabIndex={0}
      onKeyPress={() => setMinimized(!minimized)}
      onClick={() => setMinimized(!minimized)}>
      {minimized ? (
        <Copyright minimized={minimized}>©</Copyright>
      ) : (
        <Attribution>
          <Copyright minimized={minimized}>©</Copyright>
          <OpenStreetMapsLink newTab to={openStreetMapCopyrightLink}>
            OpenStreetMap
          </OpenStreetMapsLink>
          <Label>contributors</Label>
        </Attribution>
      )}
    </AttributionContainer>
  )
}

export default MapAttribution
