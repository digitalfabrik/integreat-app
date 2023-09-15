import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'

const LinkText = styled.Text`
  padding: 30px 0;
  align-self: center;
  text-decoration: underline;
`

type LinkProps = {
  url: string
  text: string
}

const Link = ({ url, text }: LinkProps): ReactElement => {
  const showSnackbar = useSnackbar()
  return (
    <LinkText onPress={() => openExternalUrl(url, showSnackbar)} accessibilityRole='link'>
      {text}
    </LinkText>
  )
}

export default Link
