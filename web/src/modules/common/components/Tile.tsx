import * as React from "react";
import { Col } from "react-styled-flexboxgrid";
import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import TileModel from "../models/TileModel";
import CleanLink from "./CleanLink";
import CleanAnchor from "./CleanAnchor";
import type { ThemeType } from "build-configs/ThemeType";
type PropsType = {
  tile: TileModel;
};
const Thumbnail: StyledComponent<{}, ThemeType, any> = styled.div`
  position: relative;
  display: block;
  width: 100%;
  margin: 0 auto;
  padding-top: 100%;

  & img {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.2s;
    object-fit: contain;
  }
`;
const ThumbnailSizer: StyledComponent<{}, ThemeType, any> = styled.div`
  width: 150px;
  max-width: 33.3vw;
  margin: 0 auto;
`;
const TileTitle: StyledComponent<{}, ThemeType, any> = styled.div`
  margin: 5px 0;
  color: ${props => props.theme.colors.textColor};
  text-align: center;
`;
const TileContainer: StyledComponent<{}, ThemeType, any> = styled(Col)`
  margin-bottom: 20px;

  & > a,
  & button {
    display: block;
    max-width: 160px;
    margin: 0 auto;
    padding: 0;
    background-color: ${props => props.theme.colors.backgroundColor};
    border: none;
    box-shadow: none;
    cursor: pointer;
  }

  & > a:hover img,
  & button:hover img {
    transform: scale(1.01);
  }
`;
/**
 * Displays a single Tile
 */

class Tile extends React.PureComponent<PropsType> {
  getTileContent(): React.ReactNode {
    return <>
        <ThumbnailSizer>
          <Thumbnail>
            <img alt='' src={this.props.tile.thumbnail} />
          </Thumbnail>
        </ThumbnailSizer>
        <TileTitle>{this.props.tile.title}</TileTitle>
      </>;
  }

  getTile(): React.ReactNode {
    const tile = this.props.tile;

    if (!tile.isExternalUrl) {
      return <CleanLink to={tile.path}>{this.getTileContent()}</CleanLink>;
    } else if (!tile.postData) {
      return <CleanAnchor href={tile.path}>{this.getTileContent()}</CleanAnchor>;
    } else {
      const inputs = [];
      tile.postData.forEach((value, key) => inputs.unshift(<input type='hidden' value={value} key={key} name={key} />));
      return <form method='POST' action={tile.path}>
          {inputs}
          <button type='submit' role='link'>
            {this.getTileContent()}
          </button>
        </form>;
    }
  }

  render() {
    return <TileContainer xs={6} sm={4} md={3}>
        {this.getTile()}
      </TileContainer>;
  }

}

export default Tile;