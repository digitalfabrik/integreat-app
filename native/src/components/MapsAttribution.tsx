import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import { openStreeMapCopyright } from 'shared'

import Link from './Link'
import Pressable from './base/Pressable'
import Text from './base/Text'

const EXPANDED_FONT_SIZE = 14
const COLLAPSED_FONT_SIZE = 20

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

const MapAttribution = (): ReactElement => {
  const { url, label, linkText, icon } = openStreeMapCopyright
  const [expanded, setExpanded] = useState<boolean>(false)
  return (
    <AttributionContainer onPress={() => setExpanded(!expanded)} role='button' expanded={expanded}>
      <Attribution>
        <Text
          variant='body2'
          style={{
            paddingRight: 4,
            color: 'rgb(0, 0, 0, 0.75)',
            fontSize: expanded ? EXPANDED_FONT_SIZE : COLLAPSED_FONT_SIZE,
            alignSelf: 'center',
          }}>
          {icon}
        </Text>
        {expanded && (
          <>
            <OpenStreetMapsLink url={url}>{linkText}</OpenStreetMapsLink>
            <Text variant='body2' style={{ padding: 4 }}>
              {label}
            </Text>
          </>
        )}
      </Attribution>
    </AttributionContainer>
  )
}
export default MapAttribution
