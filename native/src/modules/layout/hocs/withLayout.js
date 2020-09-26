// @flow

import * as React from 'react'
import { wrapDisplayName } from 'recompose'

import LayoutContainer from '../containers/LayoutContainer'

const withLayout = <T>(WrappedComponent: React.ComponentType<T>) => {
  return class extends React.Component<T> {
    static displayName = wrapDisplayName(WrappedComponent, 'withLayout')

    render () {
      return <LayoutContainer>
          <WrappedComponent {...this.props} />
      </LayoutContainer>
    }
  }
}

export default withLayout
