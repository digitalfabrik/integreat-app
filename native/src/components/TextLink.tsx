import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'

const LinkText = styled.Text`
  text-decoration: underline;
`

type TextLinkProps = {
  text: string
  url: string
}

/**
 * Touchable has a bottom spacing that we can't remove, hence this component for a link surrounded by text
 */

const TextLink = ({ text, url }: TextLinkProps): ReactElement => {
  const showSnackbar = useSnackbar()
  return (
    <LinkText onPress={() => openExternalUrl(url, showSnackbar)} accessibilityRole='link'>
      {text}
    </LinkText>
  )
}

export default TextLink
