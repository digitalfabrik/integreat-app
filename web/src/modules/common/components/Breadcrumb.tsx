import * as React from "react";
import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import helpers from "../../theme/constants/helpers";
import type { ThemeType } from "build-configs/ThemeType";
const ListItem: StyledComponent<{}, ThemeType, any> = styled.li`
  display: inline;

  & * {
    ${helpers.removeLinkHighlighting}
    color: ${props => props.theme.colors.textSecondaryColor};
    font-size: 15px;
  }
`;
const Separator: StyledComponent<{}, ThemeType, any> = styled.span`
  &::before {
    color: ${props => props.theme.colors.textDecorationColor};
    font-size: 16px;
    content: ' > ';
  }
`;
type PropsType = {
  children: React.ReactNode;
};
/**
 * Displays breadcrumbs (Links) for lower category levels
 */

class Breadcrumb extends React.PureComponent<PropsType> {
  render() {
    return <ListItem>
        <Separator aria-hidden />
        {this.props.children}
      </ListItem>;
  }

}

export default Breadcrumb;