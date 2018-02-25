import React from 'react'

/**
 * Since enzyme shallow rendering doesn't work with react-onclickoutside, here's a mock:
 */
const onClickOutside = WrappedComponent => class extends React.Component {
  static displayName = `OnClickOutside(${WrappedComponent.displayName || WrappedComponent.name})`

  render () {
    const component = <WrappedComponent {...this.props} />
    if (typeof component.type.prototype.handleClickOutside !== 'function') {
      throw new Error('WrappedComponent has no handleClickOutside handler.')
    }
    return component
  }
}

export default onClickOutside
