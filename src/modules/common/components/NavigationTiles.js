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
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`
const Separator = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
  margin: 0 15px;
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
        <Separator />
      </>
    )
  }
}

export default NavigationTiles
