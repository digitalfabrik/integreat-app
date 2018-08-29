// @flow

import * as React from 'react'

import styled from 'styled-components'
import { View, Image } from 'react-native'
import TileModel from '../models/TileModel'

type PropsType = {
  tile: TileModel
}

const Thumbnail = styled.View`
  width: 100%;
  margin: 0 auto;
  padding-top: 100%;
`

const ThumbnailSizer = styled.View`
  width: 150px;
  margin: 0 auto;
`

const TileTitle = styled.Text`
  margin: 5px 0;
  color: ${props => props.theme.colors.textColor};
  text-align: center;
`

const TileContainer = styled.View`
  margin-bottom: 20px;
`

/**
 * Displays a single Tile
 */
class Tile extends React.Component<PropsType> {
  getTileContent (): React.Node {
    return <>
      <ThumbnailSizer>
        <Thumbnail><Image source={{uri: this.props.tile.thumbnail}} /></Thumbnail>
      </ThumbnailSizer>
      <TileTitle>{this.props.tile.title}</TileTitle>
    </>
  }

  getTile (): React.Node {
    const tile = this.props.tile
    if (!tile.isExternalUrl) {
      return <View to={tile.path}>{this.getTileContent()}</View>
    } else if (!tile.postData) {
      return <View href={tile.path} target='_blank'>{this.getTileContent()}</View>
    }
  }

  render () {
    return (
      <TileContainer>
        {this.getTile()}
      </TileContainer>
    )
  }
}

export default Tile
