import React, { ReactElement } from 'react'
import styled from 'styled-components'

import StyledSmallViewTip from '../StyledSmallViewTip'

export const toggleButtonWidth = 100
const StyledButton = styled.button<{ $active: boolean | null }>`
  border: none;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.25),
    0 1px 4px 1px rgba(0, 0, 0, 0.15);
  border-radius: 18px;
  width: ${toggleButtonWidth}px;
  height: 100px;
  background-color: ${props => (props.$active ? props.theme.colors.themeColor : props.theme.colors.backgroundColor)};
  color: ${props => props.theme.colors.textSecondaryColor};
  padding: 8px;
  cursor: pointer;
`

type TextButtonProps = {
  text: string
  onClick: () => void
  icon: string
  active?: boolean
  className?: string
}

const ToggleButton = ({ text, onClick, className, ...props }: TextButtonProps): ReactElement => (
  <StyledButton type='button' onClick={onClick} $active={!!props.active} className={className}>
    <img src={props.icon} alt='' />
    <StyledSmallViewTip as='span'>{text}</StyledSmallViewTip>
  </StyledButton>
)

export default ToggleButton
