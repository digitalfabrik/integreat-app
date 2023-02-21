import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import { openStreeMapCopyright } from 'api-client/src'

import Link from './Link'

const Attribution = styled.View`
  flex-direction: row;
  display: flex;
  padding: 4px;
  align-self: center;
`
const AttributionContainer = styled.TouchableOpacity`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  justify-content: flex-end;
  min-height: 20px;
  color: rgba(0, 0, 0, 0.75);
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
`

const OpenStreetMapsLink = styled(Link)`
  padding: 0;
  color: ${props => props.theme.colors.tunewsThemeColor};
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-color: ${props => props.theme.colors.tunewsThemeColor};
`

const Label = styled.Text`
  padding: 0 4px;
  color: rgba(0, 0, 0, 0.75);
`

const Copyright = styled.Text<{ minimized: boolean }>`
  padding: 0 4px;
  color: rgba(0, 0, 0, 0.75);
  font-size: ${props => (props.minimized ? '20px' : '14px')};
  align-self: center;
`

const MapAttribution = (): ReactElement => {
  const { url, label, linkText, icon } = openStreeMapCopyright
  const [minimized, setMinimized] = useState<boolean>(true)
  return (
    <AttributionContainer onPress={() => setMinimized(!minimized)} accessibilityRole='button'>
      {minimized ? (
        <Copyright minimized={minimized}>{icon}</Copyright>
      ) : (
        <Attribution>
          <Copyright minimized={minimized}>©</Copyright>
          <OpenStreetMapsLink url={url} text={linkText} />
          <Label>{label}</Label>
        </Attribution>
      )}
    </AttributionContainer>
  )
}
export default MapAttribution
