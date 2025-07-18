import React, { ReactElement } from 'react'
import { StyleProp, TextStyle } from 'react-native'
import styled from 'styled-components/native'

import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'

const LinkText = styled.Text`
  padding: 30px 0;
  align-self: center;
  text-decoration: underline;
  color: ${props => props.theme.colors.linkColor};
`

type LinkProps = {
  url: string
  children: string
  style?: StyleProp<TextStyle>
}

const Link = ({ url, children, style }: LinkProps): ReactElement => {
  const showSnackbar = useSnackbar()
  return (
    <LinkText style={style} onPress={() => openExternalUrl(url, showSnackbar)} role='link'>
      {children}
    </LinkText>
  )
}

export default Link
