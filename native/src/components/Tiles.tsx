import * as React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import { contentDirection } from '../constants/contentDirection'
import TileModel from '../models/TileModel'
import Caption from './Caption'
import Tile from './Tile'

type PropsType = {
  title?: string
  tiles: Array<TileModel>
  onTilePress: (tile: TileModel) => void
  theme: ThemeType
  language: string
}
type TilesRowPropsType = {
  language: string
  children: React.ReactNode
  theme: ThemeType
}
const TilesRow = styled.View<TilesRowPropsType>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10px 0;
`
/**
 * Displays a table of Tiles
 */

class Tiles extends React.Component<PropsType> {
  render(): ReactNode {
    const { title, language, tiles, onTilePress, theme } = this.props
    return (
      <>
        {title && <Caption title={title} theme={theme} />}
        <TilesRow language={language} theme={theme}>
          {tiles.map(tile => (
            <Tile key={tile.path} tile={tile} onTilePress={onTilePress} theme={theme} />
          ))}
        </TilesRow>
      </>
    )
  }
}

export default Tiles
