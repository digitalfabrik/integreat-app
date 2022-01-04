import React, { ReactElement } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'

const Header = styled.header`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  user-select: none;
  flex-direction: column;
  overflow: visible;

  @media ${dimensions.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${dimensions.maxWidth}px) / 2);
    padding-left: calc((100vw - ${dimensions.maxWidth}px) / 2);
  }
`

type PropsType = {
  children: ReactElement
}

const HeaderContainer = ({ children }: PropsType): ReactElement => <Header>{children}</Header>

export default HeaderContainer
