import React from 'react'

const onClickOutside = (WrappedComponent) => class extends React.Component {
  render () {
    const component = <WrappedComponent {...this.props} />
    if (typeof component.type.prototype.handleClickOutside !== 'function') {
      throw new Error('WrappedComponent has no handleClickOutside handler.')
    }
    return component
  }
}

export default onClickOutside
