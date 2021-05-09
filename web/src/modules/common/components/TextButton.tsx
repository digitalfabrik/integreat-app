import React from "react";
import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import type { ThemeType } from "build-configs/ThemeType";
export const StyledButton: StyledComponent<{
  disabled: boolean;
}, ThemeType, any> = styled.button`
  margin: 15px 0;
  padding: 5px;
  background-color: ${props => props.theme.colors.themeColor};
  border: none;
  text-align: center;
  border-radius: 0.25em;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
`;
type ButtonPropsType = {
  onClick: () => void;
  text: string;
  disabled?: boolean;
};

class TextButton extends React.PureComponent<ButtonPropsType> {
  render() {
    const {
      onClick,
      text,
      disabled
    } = this.props;
    return <StyledButton onClick={onClick} disabled={!!disabled}>
        {text}
      </StyledButton>;
  }

}

export default TextButton;