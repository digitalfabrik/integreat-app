import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

import Icon from './base/Icon'

const Container = styled.span`
  display: flex;
  flex: 1;
  text-decoration: none;
  padding: 24px 0;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};

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
  iconSrc: string
}

const KebabActionItem = ({ text, iconSrc }: KebabActionItemProps): ReactElement => (
  <Container aria-label={text} dir='auto'>
    <StyledIcon src={iconSrc} />
    <span>{text}</span>
  </Container>
)

export default KebabActionItem
