import React, { ReactElement } from 'react'
import { LanguageResourceCacheStateType } from 'src/utils/DataContainer'
import styled from 'styled-components/native'

import { CategoryModel } from 'api-client'

import { contentDirection } from '../constants/contentDirection'
import TileModel from '../models/TileModel'
import Caption from './Caption'
import { getCachedThumbnail } from './Categories'
import Tile from './Tile'

type TilesProps = {
  title?: string
  categories: CategoryModel[]
  resourceCache: LanguageResourceCacheStateType
  onTilePress: (tile: TileModel) => void
  language: string
}
type TilesRowProps = {
  language: string
  children: React.ReactNode
}
const TilesRow = styled.View<TilesRowProps>`
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

const Tiles = ({ title, language, resourceCache, categories, onTilePress }: TilesProps): ReactElement => {
  const mapToItem = (category: CategoryModel) => ({
    title: category.title,
    path: category.path,
    thumbnail: getCachedThumbnail(category, resourceCache[category.path] ?? {}),
  })

  return (
    <>
      {!!title && <Caption title={title} />}
      <TilesRow language={language}>
        {categories.map(category => (
          <Tile
            key={category.path}
            tile={new TileModel({ ...mapToItem(category), isExternalUrl: false })}
            onTilePress={onTilePress}
          />
        ))}
      </TilesRow>
    </>
  )
}

export default Tiles
