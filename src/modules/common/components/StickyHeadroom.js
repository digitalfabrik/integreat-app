import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import style from './StickyHeadroom.css'
import Headroom from 'react-headroom'

/** This component wraps Headroom and so that it works with sticky elements:
 *  stickyNode can be any node which will stick to the top, while scrolling down it's hidden.
 *  children will get a stickyTop property with the dynamic offset of its viewport
 *  todo: test and refactor this in WEBAPP-169 */
export class StickyHeadroom extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    stickyNode: PropTypes.element.isRequired,
    stickyTop: PropTypes.number.isRequired
  }

  static defaultProps = {
    stickyTop: 0
  }

  constructor () {
    super()
    this.state = {searchUnpinned: false, searchUnfixed: true, initialized: false}
  }

  onPinSearch () {
    this.setState(Object.assign({}, this.state, {searchUnpinned: false, searchUnfixed: false}))
  }

  onUnpinSearch () {
    this.setState(Object.assign({}, this.state, {searchUnpinned: true}))
  }

  onUnfixSearch () {
    this.setState(Object.assign({}, this.state, {searchUnfixed: true}))
  }

  getChildStickyTop () {
    if (this.state.searchUnfixed || this.state.searchUnpinned || !this._headroomReference) {
      return this.props.stickyTop
    }
    return this.props.stickyTop + this._headroomReference.inner.offsetHeight
  }

  setHeadroomReference (node) {
    if (node) {
      this._headroomReference = node
      if (!this.state.initialized) {
        this.setState(Object.assign({}, this.state, {initialized: true}))
      }
    }
  }

  render () {
    const {searchUnpinned, searchUnfixed} = this.state
    const {stickyNode, children, ...headRoomProps} = this.props
    delete headRoomProps.stickyTop
    return <React.Fragment>
      <Headroom
        ref={node => this.setHeadroomReference(node)}
        className={cx({
          [style.headroom]: true,
          [style.unpinned]: searchUnpinned,
          [style.unfixed]: searchUnfixed
        })}
        disableInlineStyles
        onPin={() => this.onPinSearch()}
        onUnfix={() => this.onUnfixSearch()}
        onUnpin={() => this.onUnpinSearch()}
        children={stickyNode}
        {...headRoomProps} />
      {React.cloneElement(children, {stickyTop: this.getChildStickyTop()})}
    </React.Fragment>
  }
}

export default StickyHeadroom
