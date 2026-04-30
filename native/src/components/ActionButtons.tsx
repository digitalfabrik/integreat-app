import React, { ReactElement, ReactNode } from 'react'
import { View } from 'react-native'

const ActionButtons = ({ items }: { items: ReactNode[] }): ReactElement => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>{items}</View>
)

export default ActionButtons
