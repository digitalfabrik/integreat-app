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
