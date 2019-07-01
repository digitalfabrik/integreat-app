// @flow

import React from 'react'

import Caption from '../../../modules/common/components/Caption'
import Tile from './Tile'
import { View } from 'react-native'
import styled from 'styled-components/native'
import TileModel from '../models/TileModel'
import type { ThemeType } from '../../theme/constants/theme'
import SiteHelpfulBox from './SiteHelpfulBox'
import SpaceBetween from './SpaceBetween'
import type { TFunction } from 'react-i18next'

type PropsType = {|
  title: ?string,
  tiles: TileModel[],
  onTilePress: (tile: TileModel) => void,
  theme: ThemeType,
  navigateToFeedback: (positiveFeedback: boolean) => void,
  t: TFunction
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
    const {tiles, onTilePress, theme, navigateToFeedback, t} = this.props
    return <SpaceBetween>
      <View>
        {this.props.title && <Caption title={this.props.title} theme={theme} />}
        <TilesRow>
          {tiles.map(tile => <Tile key={tile.path} tile={tile} onTilePress={onTilePress} theme={theme} />)}
        </TilesRow>
      </View>
      <SiteHelpfulBox navigateToFeedback={navigateToFeedback} theme={theme} t={t} />
    </SpaceBetween>
  }
}

export default Tiles
