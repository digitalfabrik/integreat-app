import * as React from "react";
import Caption from "../../../modules/common/components/Caption";
import Tile from "./Tile";
import styled from "styled-components/native";
import type { StyledComponent } from "styled-components";
import "styled-components";
import TileModel from "../models/TileModel";
import type { ThemeType } from "../../theme/constants";
import { contentDirection } from "../../i18n/contentDirection";
type PropsType = {
  title?: string;
  tiles: Array<TileModel>;
  onTilePress: (tile: TileModel) => void;
  theme: ThemeType;
  language: string;
};
type TilesRowPropsType = {
  language: string;
  children: React.ReactNode;
  theme: ThemeType;
};
const TilesRow: StyledComponent<TilesRowPropsType, ThemeType, any> = styled.View`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10px 0;
`;
/**
 * Displays a table of Tiles
 */

class Tiles extends React.Component<PropsType> {
  render() {
    const {
      title,
      language,
      tiles,
      onTilePress,
      theme
    } = this.props;
    return <>
        {title && <Caption title={title} theme={theme} />}
        <TilesRow language={language} theme={theme}>
          {tiles.map(tile => <Tile key={tile.path} tile={tile} onTilePress={onTilePress} theme={theme} />)}
        </TilesRow>
      </>;
  }

}

export default Tiles;