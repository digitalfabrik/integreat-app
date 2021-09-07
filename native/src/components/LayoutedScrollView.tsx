import * as React from 'react'
import { ReactElement } from 'react'
import { RefreshControlProps, ScrollView } from 'react-native'

import LayoutContainer from './LayoutContainer'

type ScrollViewPropsType = {
  children?: React.ReactNode
  refreshControl: React.ReactElement<RefreshControlProps>
}

const LayoutedScrollView = (props: ScrollViewPropsType): ReactElement => {
  const { children, refreshControl } = props
  return (
    <LayoutContainer>
      <ScrollView
        keyboardShouldPersistTaps='always'
        refreshControl={refreshControl}
        contentContainerStyle={{
          flexGrow: 1
        }}>
        {children}
      </ScrollView>
    </LayoutContainer>
  )
}

export default LayoutedScrollView
