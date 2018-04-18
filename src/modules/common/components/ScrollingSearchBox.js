import React from 'react'
import PropTypes from 'prop-types'

import { animateScroll } from 'react-scroll'
import SearchInput from './SearchInput'
import Headroom from './Headroom'

const SCROLL_ANIMATION_DURATION = 500
const SEARCH_BAR_HEIGHT = 45

export class ScrollingSearchBox extends React.PureComponent {
  static propTypes = {
    filterText: PropTypes.string.isRequired,
    onFilterTextChange: PropTypes.func.isRequired,
    spaceSearch: PropTypes.bool,
    children: PropTypes.element.isRequired,
    placeholderText: PropTypes.string.isRequired
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

  setReference = node => {
    if (node) {
      this._node = node
      if (!this.state.initialized) {
        this.setState(prevState => ({...prevState, initialized: true}))
      }
    }
  }

  onSearchInputTextChange = value => this.onFilterTextChange(value)

  onSearchInputClick = () => this.onClick()

  render () {
    const {children, filterText, placeholderText, spaceSearch} = this.props

    return <div ref={this.setReference}>
      <Headroom pinStart={this._node ? this._node.offsetTop : 0}
                scrollHeight={SEARCH_BAR_HEIGHT}
                height={SEARCH_BAR_HEIGHT}
                stickyAncestor={children}>
        <SearchInput filterText={filterText}
                     placeholderText={placeholderText}
                     onFilterTextChange={this.onSearchInputTextChange}
                     onClickInput={this.onSearchInputClick}
                     spaceSearch={spaceSearch} />
      </Headroom>
    </div>
  }
}

export default ScrollingSearchBox
