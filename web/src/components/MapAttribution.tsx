import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import { openStreeMapCopyright } from 'shared'

import CleanLink from './CleanLink'
import Button from './base/Button'

const Attribution = styled.div`
  display: flex;
  direction: ltr;
  padding: 0 4px;
  background-color: rgb(255 255 255 / 50%);
  box-shadow: 0 2px 3px 3px rgb(0 0 0 / 10%);
  color: rgb(0 0 0 / 75%);
`

const StyledButton = styled(Button)<{ expanded: boolean }>`
  display: flex;
  position: absolute;
  top: 0;
  inset-inline-end: 0;
  justify-content: flex-end;
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
  color: rgb(0 0 0 / 75%);
`

type MapAttributionProps = {
  initialExpanded: boolean
}

const MapAttribution = ({ initialExpanded }: MapAttributionProps): ReactElement => {
  const { icon, linkText, url, label } = openStreeMapCopyright
  const [expanded, setExpanded] = useState<boolean>(initialExpanded)
  return (
    <StyledButton
      expanded={expanded}
      tabIndex={0}
      onClick={() => setExpanded(!expanded)}
      ariaLabel={`${linkText} ${label}`}>
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
    </StyledButton>
  )
}

export default MapAttribution
