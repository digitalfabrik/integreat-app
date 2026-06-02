import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableRipple, useTheme } from 'react-native-paper'

import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import Icon from './base/Icon'
import Text from './base/Text'

type PoiDetailRowProps = {
  externalUrl: string
  accessibilityLabel: string
  text: string
  icon: string
  iconEnd?: string
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  textStyle: {
    alignSelf: 'center',
    paddingHorizontal: 8,
  },
  iconEndContainer: {
    alignSelf: 'center',
  },
})

const PoiDetailRow = ({ externalUrl, text, accessibilityLabel, icon, iconEnd }: PoiDetailRowProps): ReactElement => {
  const showSnackbar = useSnackbar()
  const theme = useTheme()
  return (
    <TouchableRipple
      onPress={() => openExternalUrl(externalUrl, showSnackbar)}
      role='link'
      accessibilityLabel={accessibilityLabel}
      style={styles.container}>
      <>
        <Icon source={icon} />
        <Text style={[styles.textStyle, { color: theme.colors.primary }]}>{text}</Text>
        {!!iconEnd && (
          <View style={styles.iconEndContainer}>
            <Icon size={16} style={{ color: theme.colors.primary }} source={iconEnd} />
          </View>
        )}
      </>
    </TouchableRipple>
  )
}

export default PoiDetailRow
