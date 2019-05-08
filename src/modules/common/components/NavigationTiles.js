// @flow

import React from 'react'

import styled from 'styled-components/native'
import TileModel from '../models/TileModel'
import type { ThemeType } from '../../theme/constants/theme'
import NavigationTile from './NavigationTile'

type PropsType = {|
  tiles: TileModel[],
  theme: ThemeType
|}

const TilesRow = styled.View`
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  elevation: 1;
`

/**
 * Displays a table of NavigationTiles
 */
class NavigationTiles extends React.Component<PropsType> {
  render () {
    const {tiles, theme} = this.props
    return (
      <>
        <TilesRow theme={theme}>
          {tiles.map(tile => <NavigationTile key={tile.path} tile={tile} theme={theme} />)}
        </TilesRow>
      </>
    )
  }
}

export default NavigationTiles
