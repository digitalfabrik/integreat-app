import React from 'react'
import PropTypes from 'prop-types'

import SearchInput from './SearchInput'
import Headroom from './Headroom'

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

  setReference = node => {
    if (node) {
      this._node = node
      if (!this.state.initialized) {
        this.setState(prevState => ({...prevState, initialized: true}))
      }
    }
  }

  render () {
    const {children, filterText, placeholderText, spaceSearch} = this.props

    return <div ref={this.setReference}>
      <Headroom pinStart={this._node ? this._node.offsetTop : 0}
                scrollHeight={SEARCH_BAR_HEIGHT}
                height={SEARCH_BAR_HEIGHT}
                stickyAncestor={children}>
        <SearchInput filterText={filterText}
                     placeholderText={placeholderText}
                     onFilterTextChange={this.props.onFilterTextChange}
                     spaceSearch={spaceSearch} />
      </Headroom>
    </div>
  }
}

export default ScrollingSearchBox
