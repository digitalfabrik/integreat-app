import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useTheme } from 'styled-components/native'

import Text from './base/Text'

const styles = StyleSheet.create({
  chip: {
    borderRadius: 16,
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
})

type NewChipProps = {
  style?: StyleProp<ViewStyle>
}

const NewChip = ({ style }: NewChipProps): ReactElement => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    // react-native-paper's Chip component uses the TouchableRipple under the hood
    // Therefore, the a11y disabled state is set to true if no handler is passed
    // https://github.com/callstack/react-native-paper/issues/5070
    <View style={[styles.chip, { backgroundColor: theme.colors.primary }, style]}>
      <Text variant='body3' style={{ color: theme.colors.onPrimary }}>
        {t($ => $.common.state.new)}
      </Text>
    </View>
  )
}

export default NewChip
