import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import { openStreeMapCopyright } from 'api-client'

import CleanLink from './CleanLink'

const Attribution = styled.div`
  display: flex;
  padding: 0 4px;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 3px 3px rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.75);
`
const AttributionContainer = styled.div<{ expanded: boolean }>`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  justify-content: flex-end;
  cursor: pointer;
  font-size: ${props =>
    props.expanded ? props.theme.fonts.decorativeFontSizeSmall : props.theme.fonts.contentFontSize};
  font-weight: ${props => (props.expanded ? 'normal' : 'bold')};
`

const OpenStreetMapsLink = styled(CleanLink)`
  text-decoration: underline;
  color: ${props => props.theme.colors.tunewsThemeColor};
`

const Label = styled.span`
  padding: 0 4px;
  color: rgba(0, 0, 0, 0.75);
`

type MapAttributionProps = {
  initialExpanded: boolean
}

const MapAttribution = ({ initialExpanded }: MapAttributionProps): ReactElement => {
  const { icon, linkText, url, label } = openStreeMapCopyright
  const [expanded, setExpanded] = useState<boolean>(initialExpanded)
  return (
    <AttributionContainer
      expanded={expanded}
      role='button'
      tabIndex={0}
      onKeyPress={() => setExpanded(!expanded)}
      onClick={() => setExpanded(!expanded)}>
      <Attribution>
        <Label>{icon}</Label>
        {expanded && (
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
