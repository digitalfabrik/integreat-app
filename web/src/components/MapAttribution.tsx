import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import { openStreeMapCopyright } from 'api-client'

import CleanLink from './CleanLink'

const Attribution = styled.div`
  display: flex;
  padding: 0 4px;
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 3px 3px rgb(0 0 0 / 10%);
  color: rgba(0, 0, 0, 0.75);
`
const AttributionContainer = styled.div<{ minimized: boolean }>`
  display: flex;
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  justify-content: flex-end;
  cursor: pointer;
  font-size: ${props => (props.minimized ? props.theme.fonts.contentFontSize : props.theme.fonts.hintFontSize)};
`

const OpenStreetMapsLink = styled(CleanLink)`
  text-decoration: underline;
  color: ${props => props.theme.colors.tunewsThemeColor};
`

const Label = styled.span`
  padding: 0 4px;
  color: rgba(0, 0, 0, 0.75);
`

const MapAttribution = (): ReactElement => {
  const { icon, linkText, url, label } = openStreeMapCopyright
  const [minimized, setMinimized] = useState<boolean>(true)
  return (
    <AttributionContainer
      minimized={minimized}
      role='button'
      tabIndex={0}
      onKeyPress={() => setMinimized(!minimized)}
      onClick={() => setMinimized(!minimized)}>
      <Attribution>
        <Label>{icon}</Label>
        {!minimized && (
          <>
            <OpenStreetMapsLink newTab to={url}>
              {linkText}
            </OpenStreetMapsLink>
            <Label>{label}</Label>
          </>
        )}
      </Attribution>
    </AttributionContainer>
  )
}

export default MapAttribution
