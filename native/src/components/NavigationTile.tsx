import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled from 'styled-components/native'

import { TileModel } from 'shared'

import Icon from './base/Icon'
import Text from './base/Text'

const ICON_SIZE = 50

const Circle = styled(View)`
  margin-top: 9px;
  margin-bottom: 5px;
  border-radius: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  width: ${ICON_SIZE}px;
  background-color: ${props => props.theme.colors.surfaceVariant};
  align-items: center;
  justify-content: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1.41px;
`

type NavigationTileProps = {
  tile: TileModel<string>
  width: number
}

const NavigationTile = ({ tile, width }: NavigationTileProps): ReactElement => (
  <TouchableRipple
    borderless
    role='link'
    onPress={tile.onTilePress}
    style={{
      paddingVertical: 10,
      paddingHorizontal: 3,
      alignItems: 'center',
      width,
    }}>
    <>
      <Circle>
        <Icon source={tile.thumbnail} size={ICON_SIZE / Math.sqrt(2)} />
      </Circle>
      <Text
        variant='body3'
        style={{
          textAlign: 'center',
          marginBottom: 4,
        }}>
        {tile.title}
      </Text>
    </>
  </TouchableRipple>
)
export default NavigationTile
