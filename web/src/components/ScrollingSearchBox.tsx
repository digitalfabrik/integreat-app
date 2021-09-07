import React, { ReactNode } from 'react'

import Headroom from '@integreat-app/react-sticky-headroom'

import SearchInput from './SearchInput'

const SEARCH_BAR_HEIGHT = 45

type PropsType = {
  filterText: string
  onFilterTextChange: (filterText: string) => void
  spaceSearch: boolean
  children: ReactNode
  placeholderText: string
  onStickyTopChanged: (stickyTop: number) => void
}

type StateType = {
  initialized: boolean
}

export class ScrollingSearchBox extends React.Component<PropsType, StateType> {
  static defaultProps = { spaceSearch: false }
  _node: HTMLElement | null = null

  constructor(props: PropsType) {
    super(props)
    this.state = { initialized: false }
  }

  setReference = (node: HTMLElement | null): void => {
    if (node) {
      this._node = node
      if (!this.state.initialized) {
        this.setState(prevState => ({ ...prevState, initialized: true }))
      }
    }
  }

  render(): ReactNode {
    const { children, filterText, placeholderText, spaceSearch, onStickyTopChanged, onFilterTextChange } = this.props

    return (
      <div ref={this.setReference}>
        <Headroom
          pinStart={this._node ? this._node.offsetTop : 0}
          scrollHeight={SEARCH_BAR_HEIGHT}
          height={SEARCH_BAR_HEIGHT}
          onStickyTopChanged={onStickyTopChanged}>
          <SearchInput
            filterText={filterText}
            placeholderText={placeholderText}
            onFilterTextChange={onFilterTextChange}
            spaceSearch={spaceSearch}
          />
        </Headroom>
        {children}
      </div>
    )
  }
}

export default ScrollingSearchBox
