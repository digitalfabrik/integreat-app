// @flow

import * as React from 'react'

/**
 * Since enzyme rendering doesn't work with react-onclickoutside, here's a mock:
 */
const onClickOutside = <P> (WrappedComponent: React.ComponentType<P>) => class extends React.Component<P> {
  static displayName = `OnClickOutside(${WrappedComponent.displayName || WrappedComponent.name || typeof WrappedComponent})`

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
