import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { TileModel } from 'shared'

import { contentDirection } from '../constants/contentDirection'
import Caption from './Caption'
import Tile from './Tile'

const TilesRow = styled.View<{ language: string }>`
  display: flex;
  flex-flow: ${props => contentDirection(props.language)} wrap;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10px 0;
`

type TilesProps = {
  title?: string
  tiles: TileModel[]
  onTilePress: (tile: TileModel) => void
  language: string
}

const Tiles = ({ title, language, tiles, onTilePress }: TilesProps): ReactElement => (
  <>
    {!!title && <Caption title={title} />}
    <TilesRow language={language}>
      {tiles.map(tile => (
        <Tile key={tile.path} tile={tile} onTilePress={onTilePress} language={language} />
      ))}
    </TilesRow>
  </>
)

export default Tiles
