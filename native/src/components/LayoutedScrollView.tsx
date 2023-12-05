import * as React from 'react'
import { ReactElement } from 'react'
import { RefreshControlProps, ScrollView } from 'react-native'

import Layout from './Layout'

type LayoutedScrollViewProps = {
  children?: React.ReactNode
  refreshControl?: React.ReactElement<RefreshControlProps>
}

const LayoutedScrollView = (props: LayoutedScrollViewProps): ReactElement => {
  const { children, refreshControl } = props
  return (
    <Layout>
      <ScrollView
        keyboardShouldPersistTaps='always'
        // Fixes VirtualizedLists nesting error
        // See https://github.com/facebook/react-native/issues/31697#issuecomment-1742437232
        nestedScrollEnabled
        refreshControl={refreshControl}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        {children}
      </ScrollView>
    </Layout>
  )
}

export default LayoutedScrollView
