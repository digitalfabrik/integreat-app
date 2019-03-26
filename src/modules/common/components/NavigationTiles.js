// @flow

import React from 'react'

import styled from 'styled-components/native'
import TileModel from '../models/TileModel'
import type { ThemeType } from '../../theme/constants/theme'
import NavigationTile from './NavigationTile'

const MAX_WIDTH = 100
const TILES_PER_ROW = 3
const WIDTH_PERCENTAGE = Math.floor(MAX_WIDTH / TILES_PER_ROW)

type PropsType = {|
  tiles: TileModel[],
  theme: ThemeType
|}

const TilesRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
`

/**
 * Displays a table of NavigationTiles
 */
class NavigationTiles extends React.Component<PropsType> {
  render () {
    const {tiles, theme} = this.props
    return (
      <>

        <TilesRow>
          {tiles.map(tile => <NavigationTile key={tile.id} tile={tile}
                                   widthPercentage={WIDTH_PERCENTAGE}
                                   theme={theme} />)}
        </TilesRow>
      </>
    )
  }
}

export default NavigationTiles
