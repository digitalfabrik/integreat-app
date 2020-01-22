// @flow

import * as React from 'react'

/**
 * Since enzyme shallow rendering doesn't work with react-onclickoutside, here's a mock:
 */
const onClickOutside = <T> (WrappedComponent: React.ComponentType<T>) => class extends React.Component<T> {
  static displayName = `OnClickOutside(${WrappedComponent.displayName || WrappedComponent.name || typeof WrappedComponent})`

  render () {
    const component = <WrappedComponent {...this.props} />
    // $FlowFixMe
    if (typeof component.type.prototype.handleClickOutside !== 'function') {
      throw new Error('WrappedComponent has no handleClickOutside handler.')
    }
    return component
  }
}

export default onClickOutside
