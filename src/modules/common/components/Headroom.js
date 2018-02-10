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

  /**
   * @returns {number} the current scrollTop position of the window
   */
  static getScrollTop () {
    if (window.pageYOffset !== undefined) {
      return window.pageYOffset
    } else if (window.scrollTop !== undefined) {
      return window.scrollTop
    } else {
      return (document.documentElement || document.body.parentNode || document.body).scrollTop
    }
  }

  constructor (props) {
    super(props)
    this.handleEvent = this.handleEvent.bind(this)
    this.update = this.update.bind(this)
    this.ticking = false
    this.state = {
      transform: 0, // the current transform in px (between -scrollHeight and 0, 0: fully visible)
      stickyTop: 0 // the current stickyTop position of the sticky ancestor
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

  calcStickyTop (currentScrollTop, transform) {
    // Optimize glitching behaviour when scrolling down from the top of the page
    const shouldControlStickyAncestor = this.direction === DOWNWARDS
      ? this.props.pinStart + this.props.height <= currentScrollTop
      : this.props.pinStart <= currentScrollTop
    return shouldControlStickyAncestor ? this.props.height + transform : 0
  }

  /**
   * Updates this.lastTranform and this.lastScrollTop if the direction has changed
   * @param direction the new direction
   */
  setDirection (direction) {
    if (this.direction !== direction) {
      this.lastTransform = this.state.transform
      this.lastScrollTop = this.lastKnownScrollTop
      this.direction = direction
    }
  }

  /**
   * Calculates the new transform and stickyTop value and updates the state
   */
  update () {
    const currentScrollTop = Headroom.getScrollTop()
    this.setDirection(this.lastKnownScrollTop < currentScrollTop ? DOWNWARDS : UPWARDS)

    const transform = this.calcTransform(currentScrollTop)
    const stickyTop = this.calcStickyTop(currentScrollTop, transform)

    this.setState({transform, stickyTop})

    this.lastKnownScrollTop = currentScrollTop
    this.ticking = false
  }

  handleEvent () {
    if (!this.ticking) {
      this.ticking = true
      // Request animation frame for dom changes to optimize performance
      raf(this.update)
    }
  }

  render () {
    const {stickyAncestor, children} = this.props
    const {transform, stickyTop} = this.state
    return <React.Fragment>
      <div className={style.headroom2}
           style={{transform: `translateY(${transform}px)`}}>
        {children}
      </div>
      {stickyAncestor && React.cloneElement(stickyAncestor, {stickyTop})}
    </React.Fragment>
  }
}

export default Headroom
