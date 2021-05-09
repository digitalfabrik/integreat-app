import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import type { ThemeType } from "build-configs/ThemeType";
const StyledSmallViewTip: StyledComponent<{}, ThemeType, any> = styled.p`
  display: block;
  font-size: 12px;
  font-weight: 700;
`;
export default StyledSmallViewTip;