import React from 'react'
import PropTypes from 'prop-types'

import style from './ScrollingSearchBox.css'
import { animateScroll } from 'react-scroll'
import SearchInput from './SearchInput'

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

  onClick () {
    const documentScroll = document.documentElement.scrollTop
    const elementTop = this._node.offsetTop
    if (documentScroll < elementTop) {
      this.scroll()
    }
  }

  scroll () {
    const elementTop = this._node.offsetTop
    animateScroll.scrollTo(elementTop, {duration: 500})
  }

  onFilterTextChange (value) {
    this.props.onFilterTextChange(value)
    this.scroll()
  }

  setReference (node) {
    if (node) {
      this._node = node
    }
  }

  render () {
    return <React.Fragment>
      <div ref={node => this.setReference(node)} className={style.searchBar}
           style={{'top': this.props.stickyTop + 'px'}}>
        <SearchInput filterText={this.props.filterText} onFilterTextChange={value => this.onFilterTextChange(value)}
                     onClickInput={() => this.onClick()}
                     spaceSearch={this.props.spaceSearch} />
      </div>
      <div className={style.searching}>
        {React.cloneElement(this.props.children, {stickyTop: this.props.stickyTop + 45})}
      </div>
    </React.Fragment>
  }
}

export default ScrollingSearchBox
