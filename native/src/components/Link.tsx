import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import openExternalUrl from '../utils/openExternalUrl'
import Touchable from './Touchable'

const LinkText = styled.Text`
  padding: 30px 0;
  align-self: center;
  text-decoration: underline;
`

type LinkProps = {
  url: string
  text: string
}

const Link = ({ url, text }: LinkProps): ReactElement => (
  <Touchable onPress={() => openExternalUrl(url)} accessibilityRole='link' underlayColor='transparent'>
    <LinkText>{text}</LinkText>
  </Touchable>
)

export default Link
