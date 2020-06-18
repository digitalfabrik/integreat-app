// @flow

import * as React from 'react'
import wrapDisplayName from '../modules/common/utils/wrapDisplayName'

/**
 * Since enzyme rendering doesn't work with react-onclickoutside, here's a mock:
 */
const onClickOutside = <P> (WrappedComponent: React.ComponentType<P>) => class extends React.Component<P> {
  static displayName = wrapDisplayName(WrappedComponent, 'OnClickOutside')

  checkRef = (instance: mixed) => {
    if (!instance || typeof instance.handleClickOutside !== 'function') {
      throw new Error('WrappedComponent has no handleClickOutside handler.')
    }
  }

  render () {
    return <WrappedComponent ref={this.checkRef} {...this.props} />
  }
}

export default onClickOutside
