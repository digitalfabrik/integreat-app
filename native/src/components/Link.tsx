import React, { ReactElement } from 'react'
import { StyleProp, TextStyle, StyleSheet } from 'react-native'
import { useTheme } from 'styled-components/native'

import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import Text from './base/Text'

type LinkProps = {
  url: string
  children: string
  style?: StyleProp<TextStyle>
}

const Link = ({ url, children, style }: LinkProps): ReactElement => {
  const showSnackbar = useSnackbar()
  const theme = useTheme()

  const styles = StyleSheet.create({
    linkText: {
      paddingVertical: 30,
      alignSelf: 'center',
      textDecorationLine: 'underline',
      color: theme.colors.primary,
    },
  })

  return (
    <Text
      variant='body2'
      style={[styles.linkText, style]}
      onPress={() => openExternalUrl(url, showSnackbar)}
      role='link'>
      {children}
    </Text>
  )
}

export default Link
