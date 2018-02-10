import React from 'react'
import PropTypes from 'prop-types'
import raf from 'raf'

import style from './Headroom.css'

const UPWARDS = 'up'
const DOWNWARDS = 'down'

class Headroom extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired, // The child node to be displayed as a header
    scrollHeight: PropTypes.number.isRequired, // The maximum amount of px the header should move up when scrolling
    pinStart: PropTypes.number.isRequired, // The minimum scrollTop position where the transform should start
    stickyAncestor: PropTypes.node, // Gets rendered with a corresponding stickyTop prop as an ancestor
    height: PropTypes.number // Used for rendering stickyTop position of stickyAncestor
  }

  static defaultProps = {
    pinStart: 0
  }

  constructor (props) {
    super(props)
    this.handleEvent = this.handleEvent.bind(this)
    this.update = this.update.bind(this)
    this.ticking = false
    this.state = {
      transform: 0 // the current transform in px (between -scrollHeight and 0, 0: fully visible)
    }
    this.lastKnownScrollTop = 0 // the very last scrollTop which we know about (to determine direction changes)
    this.direction = DOWNWARDS // the current direction that the user is scrolling into
    this.lastTransform = 0 // the transform in px when the user last changed his scrolling direction
    this.lastScrollTop = 0 // the scrollTop when the user last changed his scrolling direction
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleEvent)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll touchstart touchmove', this.handleEvent)
  }

  static getScrollTop () {
    if (window.pageYOffset !== undefined) {
      return window.pageYOffset
    } else if (window.scrollTop !== undefined) {
      return window.scrollTop
    } else {
      return (document.documentElement || document.body.parentNode || document.body).scrollTop
    }
  }

  /**
   * Calculates the new transform value depending on the currentScrollTop position
   * @param currentScrollTop
   * @returns {number} the new transform value between -this.props.scrollHeight and 0
   */
  calcTransform (currentScrollTop) {
    // Calculate new transform value while only regarding delta ScrollTop:
    const scrolledTransform = this.lastTransform + (this.lastScrollTop - currentScrollTop)
    // Transform should be at least:
    // -this.props.scrollHeight, so we don't transform the header higher than we allow
    // this.props.pinStart - currentScrollTop, so don't transform the header until we scrolled below this.props.pinStart
    const maxTransform = Math.max(-this.props.scrollHeight, scrolledTransform, this.props.pinStart - currentScrollTop)
    // Also we never want to translate the header down, so it should always be <= 0.
    return Math.min(0, maxTransform)
  }

  update () {
    const currentScrollTop = Headroom.getScrollTop()
    if (this.lastKnownScrollTop < currentScrollTop) { // We're moving down
      if (this.direction === UPWARDS) { // We're changing direction from up to down!
        this.lastTransform = this.state.transform
        this.lastScrollTop = this.lastKnownScrollTop
        this.direction = DOWNWARDS
      }
    } else if (this.lastKnownScrollTop > currentScrollTop) { // We're moving up
      if (this.direction === DOWNWARDS) { // We're changing direction from down to up!
        this.lastTransform = this.state.transform
        this.lastScrollTop = this.lastKnownScrollTop
        this.direction = UPWARDS
      }
    }
    this.lastKnownScrollTop = currentScrollTop
    const newTransform = this.calcTransform(currentScrollTop)
    if (newTransform !== this.state.transform) {
      this.setState({transform: newTransform})
    }
    this.ticking = false
  }

  handleEvent () {
    if (!this.ticking) {
      this.ticking = true
      raf(this.update)
    }
  }

  render () {
    const {height, stickyAncestor, children} = this.props
    const {transform} = this.state
    return <React.Fragment>
      <div className={style.headroom2}
           style={{transform: `translateY(${transform}px)`}}>
        {children}
      </div>
      {stickyAncestor && React.cloneElement(stickyAncestor, {stickyTop: height + transform})}
    </React.Fragment>
  }
}

export default Headroom
