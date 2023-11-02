import * as React from 'react'
import { ReactElement } from 'react'
import { RefreshControlProps, ScrollView } from 'react-native'

import Layout from './Layout'

type LayoutedScrollViewProps = {
  children?: React.ReactNode
  refreshControl?: React.ReactElement<RefreshControlProps>
  nestedScrollEnabled?: boolean
}

const LayoutedScrollView = (props: LayoutedScrollViewProps): ReactElement => {
  const { children, refreshControl, nestedScrollEnabled = true } = props
  return (
    <Layout>
      <ScrollView
        keyboardShouldPersistTaps='always'
        refreshControl={refreshControl}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        nestedScrollEnabled={nestedScrollEnabled}>
        {children}
      </ScrollView>
    </Layout>
  )
}

export default LayoutedScrollView
