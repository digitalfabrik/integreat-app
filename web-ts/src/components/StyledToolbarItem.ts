import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import CleanAnchor from "../../common/components/CleanAnchor";
import dimensions from "../../theme/constants/dimensions";
import type { ThemeType } from "build-configs/ThemeType";
const StyledToolbarItem: StyledComponent<{}, ThemeType, any> = styled(CleanAnchor)`
  display: inline-block;
  margin: 0 10px;
  padding: 8px;
  cursor: pointer;
  border: none;
  color: ${props => props.theme.colors.textColor};
  background-color: ${props => props.theme.colors.backgroundColor};
  text-align: center;

  @media ${dimensions.smallViewport} {
    line-height: 1.15;
  }
`;
export default StyledToolbarItem;