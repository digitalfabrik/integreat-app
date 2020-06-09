// @flow

import * as React from 'react'

/**
 * Since enzyme shallow rendering doesn't work with react-onclickoutside, here's a mock:
 */
const onClickOutside = <T> (WrappedComponent: React.ComponentType<T>) => class extends React.Component<T> {
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
