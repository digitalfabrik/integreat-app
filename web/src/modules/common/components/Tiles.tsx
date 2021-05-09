import React from "react";
import Caption from "../../../modules/common/components/Caption";
import Tile from "./Tile";
import { Row } from "react-styled-flexboxgrid";
import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import TileModel from "../models/TileModel";
import type { ThemeType } from "build-configs/ThemeType";
type PropsType = {
  title: string | null | undefined;
  tiles: Array<TileModel>;
};
const TilesRow: StyledComponent<{}, ThemeType, any> = styled(Row)`
  padding: 10px 0;
`;
/**
 * Displays a table of Tiles
 */

class Tiles extends React.PureComponent<PropsType> {
  render() {
    return <div>
        {this.props.title && <Caption title={this.props.title} />}
        <TilesRow>
          {this.props.tiles.map(tile => <Tile key={tile.path} tile={tile} />)}
        </TilesRow>
      </div>;
  }

}

export default Tiles;