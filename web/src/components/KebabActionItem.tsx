import styled from '@emotion/styled'
import { SvgIconProps } from '@mui/material/SvgIcon'
import React, { ElementType, ReactElement } from 'react'

import Icon from './base/Icon'

const Container = styled.span`
  display: flex;
  flex: 1;
  text-decoration: none;
  padding: 24px 0;

  & > span {
    padding: 0 28px;
    align-self: center;
    color: ${props => props.theme.colors.textColor};
  }
`

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

type KebabActionItemProps = {
  text: string
  iconSrc: string | ElementType<SvgIconProps>
}

const KebabActionItem = ({ text, iconSrc }: KebabActionItemProps): ReactElement => (
  <Container aria-label={text} dir='auto'>
    <StyledIcon src={iconSrc} />
    <span>{text}</span>
  </Container>
)

export default KebabActionItem
