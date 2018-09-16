// @flow

import * as React from 'react'
import { wrapDisplayName } from 'recompose'

import LayoutContainer from '../containers/LayoutContainer'

const withLayout = (WrappedComponent: React.ComponentType<*>) => {
  return class extends React.Component<{}> {
    static displayName = wrapDisplayName(WrappedComponent, 'withLayout')

    render () {
      return <LayoutContainer>
          <WrappedComponent {...this.props} />
      </LayoutContainer>
    }
  }
}

export default withLayout
