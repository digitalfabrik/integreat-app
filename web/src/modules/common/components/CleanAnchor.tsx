import * as React from "react";
import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import type { ThemeType } from "build-configs/ThemeType";
const StyledAnchor: StyledComponent<{}, ThemeType, any> = styled.a`
  color: inherit;
  text-decoration: none;
`;
type PropsType = {
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
};

class CleanAnchor extends React.PureComponent<PropsType> {
  render() {
    const {
      href,
      children,
      className,
      ariaLabel
    } = this.props;
    return <StyledAnchor aria-label={ariaLabel} className={className} href={href}>
        {children}
      </StyledAnchor>;
  }

}

export default CleanAnchor;