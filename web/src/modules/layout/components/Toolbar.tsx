import type { Node } from "react";
import React from "react";
import styled from "styled-components";
import type { TFunction } from "react-i18next";
import { withTranslation } from "react-i18next";
import dimensions from "../../theme/constants/dimensions";
const ToolbarContainer = styled.div`
  display: flex;
  width: 75px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;

  & > * {
    opacity: 0.7;
    font-size: 1.5rem;
    transition: 0.2s opacity;
  }

  & > *:hover {
    opacity: 1;
  }

  @media ${dimensions.smallViewport} {
    width: 100%;
    flex-flow: row wrap;
    justify-content: center;
  }
`;
const Headline = styled.h5`
  width: 100vw;
  margin: 0;
  text-align: center;
  font-size: 90%;
`;
type PropsType = {
  className?: string;
  children?: Node;
  viewportSmall: boolean;
  t: TFunction;
};

class Toolbar extends React.PureComponent<PropsType> {
  render() {
    const {
      viewportSmall,
      t
    } = this.props;
    return <ToolbarContainer className={this.props.className} viewportSmall={viewportSmall}>
        {viewportSmall && <Headline>{t('isThisSiteUseful')}</Headline>}
        {this.props.children}
      </ToolbarContainer>;
  }

}

export default withTranslation<PropsType>('feedback')(Toolbar);