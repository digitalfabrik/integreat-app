// @flow

import React from 'react'

import Caption from '../../../modules/common/components/Caption'
import Tile from './Tile'
import styled from 'styled-components/native'
import TileModel from '../models/TileModel'
import type { ThemeType } from '../../theme/constants/theme'

type PropsType = {|
  title?: string,
  tiles: TileModel[],
  onTilePress: (tile: TileModel) => void,
  theme: ThemeType
|}

const TilesRow = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 0;
`

/**
 * Displays a table of Tiles
 */
class Tiles extends React.Component<PropsType> {
  render () {
    const { title, tiles, onTilePress, theme } = this.props
    return <>
      {title && <Caption title={title} theme={theme} />}
      <TilesRow>
        {tiles.map(tile => <Tile key={tile.path} tile={tile} onTilePress={onTilePress} theme={theme} />)}
      </TilesRow>
    </>
  }
}

export default Tiles
