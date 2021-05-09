import * as React from "react";
import EastereggImage from "./EastereggImage";
import styled from "styled-components/native";
import type { StyledComponent } from "styled-components";
import "styled-components";
import type { ThemeType } from "build-configs/ThemeType";
type PropsType = {
  clearResourcesAndCache: () => void;
  theme: ThemeType;
};
const Wrapper: StyledComponent<{
  children: React.ReactNode;
}, {}, any> = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class Heading extends React.Component<PropsType> {
  render() {
    const {
      clearResourcesAndCache,
      theme
    } = this.props;
    return <Wrapper>
        <EastereggImage clearResourcesAndCache={clearResourcesAndCache} theme={theme} />
      </Wrapper>;
  }

}

export default Heading;