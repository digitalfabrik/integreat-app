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

  scroll () {
    const elementTop = this._node.offsetTop
    animateScroll.scrollTo(elementTop, {duration: SCROLL_ANIMATION_DURATION})
  }

  onFilterTextChange (value) {
    this.props.onFilterTextChange(value)
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
                     spaceSearch={spaceSearch} />
      </Headroom>
    </div>
  }
}

export default ScrollingSearchBox
