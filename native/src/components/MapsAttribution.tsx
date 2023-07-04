import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import { openStreeMapCopyright } from 'api-client/src'

import Link from './Link'

const Attribution = styled.View`
  flex-direction: row;
  display: flex;
  align-self: center;
`

const AttributionContainer = styled.TouchableOpacity`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  justify-content: flex-end;
  color: rgba(0, 0, 0, 0.75);
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
`

const OpenStreetMapsLink = styled(Link)`
  padding: 4px 0;
  color: ${props => props.theme.colors.tunewsThemeColor};
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-color: ${props => props.theme.colors.tunewsThemeColor};
  align-self: center;
`

const Label = styled.Text`
  padding: 4px;
`

const Copyright = styled.Text<{ expanded: boolean }>`
  padding-right: 4px;
  color: rgba(0, 0, 0, 0.75);
  font-size: ${props => (props.expanded ? '14px' : '20px')};
  align-self: center;
`

const MapAttribution = (): ReactElement => {
  const { url, label, linkText, icon } = openStreeMapCopyright
  const [expanded, setExpanded] = useState<boolean>(false)
  return (
    <AttributionContainer onPress={() => setExpanded(!expanded)} accessibilityRole='button'>
      <Attribution>
        <Copyright expanded={expanded}>{icon}</Copyright>
        {expanded && (
          <>
            <OpenStreetMapsLink url={url} text={linkText} />
            <Label>{label}</Label>
          </>
        )}
      </Attribution>
    </AttributionContainer>
  )
}
export default MapAttribution
