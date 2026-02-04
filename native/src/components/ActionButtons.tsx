import React, { ReactElement, ReactNode } from 'react'
import { Appbar } from 'react-native-paper'

const ActionButtons = ({ items }: { items: ReactNode[] }): ReactElement => (
  <Appbar.Header style={{ paddingHorizontal: 0, gap: 8, backgroundColor: 'transparent' }} statusBarHeight={0}>
    {items}
  </Appbar.Header>
)

export default ActionButtons
