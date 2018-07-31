// @flow

import React from 'react'
import type Node from 'react'

import SearchInput from './SearchInput'
import Headroom from './Headroom'

const SEARCH_BAR_HEIGHT = 45

type PropsType = {
  filterText: string,
  onFilterTextChange: (string) => void,
  spaceSearch: boolean,
  children: Node,
  placeholderText: string
}

type StateType = {
  initialized: boolean
}

export class ScrollingSearchBox extends React.PureComponent<PropsType, StateType> {
  _node: Node

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
