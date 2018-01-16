import React from 'react'
import PropTypes from 'prop-types'

import style from './ScrollingSearchContainer.css'
import { animateScroll } from 'react-scroll/modules/index'
import SearchInput from './SearchInput'

export class ScrollingSearchContainer extends React.Component {
  static propTypes = {
    filterText: PropTypes.string.isRequired,
    onFilterTextChange: PropTypes.func.isRequired,
    stickyTop: PropTypes.number.isRequired,
    spaceSearch: PropTypes.bool,
    children: PropTypes.node
  }

  static defaultProps = {
    stickyTop: 0
  }

  onClick = () => {
    const scrollTop = document.documentElement.scrollTop
    if (scrollTop < this.state.top) {
      this.scroll()
    }
  }

  scroll = () => {
    animateScroll.scrollTo(this.state.top, {duration: 500})
  }

  onFilterTextChange = value => {
    this.props.onFilterTextChange(value)
    this.scroll()
  }

  setDimensions = node => {
    if (node) {
      const {top, height} = node.getBoundingClientRect()
      this.setState(Object.assign({}, this.state, {top, height}))
    }
  }

  render () {
    return <React.Fragment>
      <div ref={this.setDimensions} className={style.searchBar}
           style={{'top': this.props.stickyTop + 'px'}}>
        <SearchInput filterText={this.props.filterText} onFilterTextChange={this.onFilterTextChange} onClick={this.onClick}
                     spaceSearch={this.props.spaceSearch} />
      </div>
      <div className={style.searching}>
        {React.cloneElement(this.props.children, {stickyTop: this.props.stickyTop + 45})}
      </div>
    </React.Fragment>
  }
}

export default ScrollingSearchContainer
