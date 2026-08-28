import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableRipple, useTheme } from 'react-native-paper'

import useOpenExternalUrl from '../utils/openExternalUrl'
import Icon from './base/Icon'
import Text from './base/Text'

type PlaceDetailRowProps = {
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

const PlaceDetailRow = ({
  externalUrl,
  text,
  accessibilityLabel,
  icon,
  iconEnd,
}: PlaceDetailRowProps): ReactElement => {
  const openExternalUrl = useOpenExternalUrl()
  const theme = useTheme()
  return (
    <TouchableRipple
      onPress={() => openExternalUrl(externalUrl)}
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

export default PlaceDetailRow
