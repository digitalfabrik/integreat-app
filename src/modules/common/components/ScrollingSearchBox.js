import React from 'react'
import PropTypes from 'prop-types'

import { animateScroll } from 'react-scroll'
import SearchInput from './SearchInput'
import StickyHeadroom from './StickyHeadroom'

const SCROLL_ANIMATION_DURATION = 500

export class ScrollingSearchBox extends React.Component {
  static propTypes = {
    filterText: PropTypes.string.isRequired,
    onFilterTextChange: PropTypes.func.isRequired,
    spaceSearch: PropTypes.bool,
    children: PropTypes.element.isRequired
  }

  constructor () {
    super()
    this.state = {initialized: false}
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

  render () {
    return <div ref={node => this.setReference(node)}>
      <StickyHeadroom pinStart={this._node ? this._node.offsetTop : 0}
                      stickyNode={<SearchInput filterText={this.props.filterText}
                                               onFilterTextChange={value => this.onFilterTextChange(value)}
                                               onClickInput={() => this.onClick()}
                                               spaceSearch={this.props.spaceSearch} />}>
        {this.props.children}
      </StickyHeadroom>
    </div>
  }
}

export default ScrollingSearchBox
