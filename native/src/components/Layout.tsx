import React, { ReactElement } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

const Wrapper = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundColor};
`

type AppPropsType = {
  children?: React.ReactNode
}

const Layout = ({ children }: AppPropsType): ReactElement => {
  const theme = useTheme()
  return <Wrapper theme={theme}>{children}</Wrapper>
}

export default Layout
