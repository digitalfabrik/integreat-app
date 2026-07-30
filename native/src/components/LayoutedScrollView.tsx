import React, { ReactElement } from 'react'
import { RefreshControlProps, ScrollView, StyleProp, ViewStyle } from 'react-native'

import Layout from './Layout'

type LayoutedScrollViewProps = {
  children?: React.ReactNode
  refreshControl?: React.ReactElement<RefreshControlProps>
  style?: StyleProp<ViewStyle>
}

const LayoutedScrollView = ({ children, refreshControl, style }: LayoutedScrollViewProps): ReactElement => (
  <Layout>
    <ScrollView
      keyboardShouldPersistTaps='always'
      // Fixes VirtualizedLists nesting error
      // See https://github.com/facebook/react-native/issues/31697#issuecomment-1742437232
      nestedScrollEnabled
      refreshControl={refreshControl}
      contentContainerStyle={[
        {
          flexGrow: 1,
        },
        style,
      ]}>
      {children}
    </ScrollView>
  </Layout>
)

export default LayoutedScrollView
