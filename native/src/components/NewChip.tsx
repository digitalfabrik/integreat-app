import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { Chip } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

import Text from './base/Text'

const styles = StyleSheet.create({
  chip: {
    borderRadius: 16,
    alignSelf: 'center',
  },
  label: {
    lineHeight: 16,
    marginVertical: 4,
    marginHorizontal: 8,
  },
})

type NewChipProps = {
  style?: StyleProp<ViewStyle>
}

const NewChip = ({ style }: NewChipProps): ReactElement => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Chip style={[styles.chip, { backgroundColor: theme.colors.primary }, style]} textStyle={styles.label} compact>
      <Text variant='body2' style={{ color: theme.colors.onPrimary }}>
        {t($ => $.common.state.new)}
      </Text>
    </Chip>
  )
}

export default NewChip
