import React from "react";
import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import type { ThemeType } from "build-configs/ThemeType";
const Identifier: StyledComponent<{}, ThemeType, any> = styled.span`
  font-weight: 700;
`;
type PropsType = {
  identifier: string;
  information: string;
};

class PageDetail extends React.PureComponent<PropsType> {
  render() {
    const {
      identifier,
      information
    } = this.props;
    return <div>
        <Identifier>{identifier}: </Identifier>
        <span>{information}</span>
      </div>;
  }

}

export default PageDetail;