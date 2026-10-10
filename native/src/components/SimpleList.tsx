import React, { ReactElement } from 'react'
import { View, ViewStyle } from 'react-native'

import { withDividers } from '../utils'

type SimpleListProps<T> = {
  items: T[]
  renderItem: (props: { item: T; index: number }) => ReactElement
  keyExtractor: (item: T) => string
  accessibilityLabel?: string
  style?: ViewStyle
}

const SimpleList = <T,>({
  items,
  renderItem,
  keyExtractor,
  accessibilityLabel,
  style,
}: SimpleListProps<T>): ReactElement => (
  <View accessibilityRole='list' style={style}>
    {withDividers(
      items.map((item, index) => (
        <View key={keyExtractor(item)} accessibilityLabel={accessibilityLabel}>
          {renderItem({ item, index })}
        </View>
      )),
    )}
  </View>
)

export default SimpleList
