import React, { ReactElement, ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

const Wrapper = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`

type LayoutProps = {
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

const Layout = ({ children, style }: LayoutProps): ReactElement => <Wrapper style={style}>{children}</Wrapper>

export default Layout
