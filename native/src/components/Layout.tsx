import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

type WrapperPropsType = {
  theme: ThemeType
}

const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props: WrapperPropsType) => props.theme.colors.backgroundColor};
`

type AppPropsType = {
  children?: React.ReactNode
  theme: ThemeType
}

const Layout = ({ children, theme }: AppPropsType): ReactElement => <Wrapper theme={theme}>{children}</Wrapper>

export default Layout
