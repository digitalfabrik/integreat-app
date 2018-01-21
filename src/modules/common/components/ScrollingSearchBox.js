import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import style from './ScrollingSearchBox.css'
import { animateScroll } from 'react-scroll'
import SearchInput from './SearchInput'
import Headroom from 'react-headroom'

const SCROLL_ANIMATION_DURATION = 500
const SEARCH_INPUT_HEIGHT = 45

export class ScrollingSearchBox extends React.Component {
  static propTypes = {
    filterText: PropTypes.string.isRequired,
    onFilterTextChange: PropTypes.func.isRequired,
    stickyTop: PropTypes.number.isRequired,
    spaceSearch: PropTypes.bool,
    children: PropTypes.element.isRequired
  }

  static defaultProps = {
    stickyTop: 0
  }

  constructor () {
    super()
    this.state = {searchUnpinned: false, searchUnfixed: true, initialized: false}
  }

  onClick () {
    // Some browsers scroll at html level (chrome, firefox, ie11), some at body level (edge).
    const documentScroll = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
    const elementTop = this._node.offsetTop
    if (documentScroll < elementTop) {
      this.scroll()
    }
  }

  scroll () {
    const elementTop = this._node.offsetTop
    animateScroll.scrollTo(elementTop, {duration: SCROLL_ANIMATION_DURATION})
  }

  onFilterTextChange (value) {
    this.props.onFilterTextChange(value)
    this.scroll()
  }

  setReference (node) {
    if (node) {
      this._node = node
      if (!this.state.initialized) {
        this.setState(Object.assign({}, this.state, {initialized: true}))
      }
    }
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
    return this.props.stickyTop +
      (!this.state.searchUnfixed && !this.state.searchUnpinned) ? SEARCH_INPUT_HEIGHT : 0
  }

  render () {
    const childStickyTop = this.getChildStickyTop()
    const {searchUnpinned, searchUnfixed} = this.state
    return <div ref={node => this.setReference(node)}>
      <Headroom pinStart={this._node ? this._node.offsetTop : 0}
                className={cx({
                  [style.headroom]: true,
                  [style.unpinned]: searchUnpinned,
                  [style.unfixed]: searchUnfixed
                })}
                disableInlineStyles
                onPin={() => this.onPinSearch()}
                onUnfix={() => this.onUnfixSearch()}
                onUnpin={() => this.onUnpinSearch()}>
        <SearchInput filterText={this.props.filterText}
                     onFilterTextChange={value => this.onFilterTextChange(value)}
                     onClickInput={() => this.onClick()}
                     spaceSearch={this.props.spaceSearch} />
      </Headroom>
      {React.cloneElement(this.props.children, {stickyTop: childStickyTop})}
    </div>
  }
}

export default ScrollingSearchBox
