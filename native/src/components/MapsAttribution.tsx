import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import { openStreeMapCopyright } from 'shared'

import Link from './Link'
import Pressable from './base/Pressable'

const Attribution = styled.View`
  flex-direction: row;
  display: flex;
  align-self: center;
`

const AttributionContainer = styled(Pressable)<{ expanded: boolean }>`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  justify-content: flex-end;
  color: rgb(0, 0, 0, 0.75);
  font-family: ${props => props.theme.legacy.fonts.native.contentFontRegular};
  ${props => props.expanded && `background-color: rgb(255, 255, 255, 0.75);`}
`

const OpenStreetMapsLink = styled(Link)`
  padding: 4px 0;
  color: ${props => props.theme.colors.tunews.main};
  text-decoration: underline solid ${props => props.theme.colors.tunews.main};
  align-self: center;
`

const Label = styled.Text`
  padding: 4px;
`

const Copyright = styled.Text<{ expanded: boolean }>`
  padding-right: 4px;
  color: rgb(0, 0, 0, 0.75);
  font-size: ${props => (props.expanded ? '14px' : '20px')};
  align-self: center;
`

const MapAttribution = (): ReactElement => {
  const { url, label, linkText, icon } = openStreeMapCopyright
  const [expanded, setExpanded] = useState<boolean>(false)
  return (
    <AttributionContainer onPress={() => setExpanded(!expanded)} role='button' expanded={expanded}>
      <Attribution>
        <Copyright expanded={expanded}>{icon}</Copyright>
        {expanded && (
          <>
            <OpenStreetMapsLink url={url}>{linkText}</OpenStreetMapsLink>
            <Label>{label}</Label>
          </>
        )}
      </Attribution>
    </AttributionContainer>
  )
}
export default MapAttribution
