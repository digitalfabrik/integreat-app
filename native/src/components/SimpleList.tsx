import React, { ReactElement } from 'react'
import { View, ViewStyle } from 'react-native'

import { withDividers } from '../utils'

type SimpleListProps<T> = {
  items: T[]
  renderItem: (props: { item: T; index: number }) => ReactElement
  style?: ViewStyle
}

const SimpleList = <T,>({ items, renderItem, style }: SimpleListProps<T>): ReactElement => (
  <View accessibilityRole='list' style={style}>
    {withDividers(items.map((item, index) => renderItem({ item, index })))}
  </View>
)

export default SimpleList
