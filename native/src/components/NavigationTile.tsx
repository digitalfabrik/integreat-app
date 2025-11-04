import React, { JSXElementConstructor, ReactElement } from 'react'
import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import { TileModel } from 'shared'

import SimpleImage from './SimpleImage'
import Pressable from './base/Pressable'

const ICON_SIZE = 50

const Circle = styled(View)`
  margin-top: 9px;
  margin-bottom: 5px;
  border-radius: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  width: ${ICON_SIZE}px;
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
  align-items: center;
  justify-content: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1.41px;
`

const TileTitle = styled.Text`
  color: ${props => props.theme.legacy.colors.textColor};
  text-align: center;
  font-size: 11px;
  margin-bottom: 5px;
`

const StyledPressable = styled(Pressable)<{ width: number }>`
  padding: 10px 3px;
  width: ${props => props.width}px;
  align-items: center;
`

const StyledIcon = styled(SimpleImage)`
  width: ${ICON_SIZE / Math.sqrt(2)}px;
  height: ${ICON_SIZE / Math.sqrt(2)}px;
`

type NavigationTileProps = {
  tile: TileModel<JSXElementConstructor<SvgProps>>
  width: number
}

const NavigationTile = ({ tile, width }: NavigationTileProps): ReactElement => (
  <StyledPressable role='link' onPress={tile.onTilePress} width={width}>
    <Circle>
      <StyledIcon source={tile.thumbnail} />
    </Circle>
    <TileTitle>{tile.title}</TileTitle>
  </StyledPressable>
)

export default NavigationTile
