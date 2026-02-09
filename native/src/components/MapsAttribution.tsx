import React, { ReactElement, useState } from 'react'
import { StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled from 'styled-components/native'

import { openStreeMapCopyright } from 'shared'

import Link from './Link'
import Text from './base/Text'

const EXPANDED_FONT_SIZE = 14
const COLLAPSED_FONT_SIZE = 20

const Attribution = styled.View`
  flex-direction: row;
  display: flex;
  align-self: center;
`

const OpenStreetMapsLink = styled(Link)`
  padding: 4px 0;
  color: ${props => props.theme.colors.tunews.main};
  text-decoration: underline solid ${props => props.theme.colors.tunews.main};
  align-self: center;
`

const styles = StyleSheet.create({
  attributionContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
  expanded: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  transparentTextColor: {
    color: 'rgba(0, 0, 0, 0.75)',
  },
})

const MapAttribution = (): ReactElement => {
  const { url, label, linkText, icon } = openStreeMapCopyright
  const [expanded, setExpanded] = useState<boolean>(false)
  return (
    <TouchableRipple
      borderless
      onPress={() => setExpanded(!expanded)}
      role='button'
      style={[styles.attributionContainer, expanded && styles.expanded]}>
      <Attribution>
        <Text
          variant='body2'
          style={[
            styles.transparentTextColor,
            {
              paddingRight: 4,
              fontSize: expanded ? EXPANDED_FONT_SIZE : COLLAPSED_FONT_SIZE,
              alignSelf: 'center',
            },
          ]}>
          {icon}
        </Text>
        {expanded && (
          <>
            <OpenStreetMapsLink url={url}>{linkText}</OpenStreetMapsLink>
            <Text variant='body2' style={[styles.transparentTextColor, { padding: 4 }]}>
              {label}
            </Text>
          </>
        )}
      </Attribution>
    </TouchableRipple>
  )
}
export default MapAttribution
