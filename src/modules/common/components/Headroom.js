import React from 'react'
import PropTypes from 'prop-types'
import { HeaderWrapper } from './Headroom.styles'

const UPWARDS = 'up'
const DOWNWARDS = 'down'

const UNPINNED = 'unpinned'
const PINNED = 'pinned'
const STATIC = 'static'

class Headroom extends React.PureComponent {
  static propTypes = {
    /** The child node to be displayed as a header */
    children: PropTypes.any.isRequired,
    /** The maximum amount of px the header should move up when scrolling */
    scrollHeight: PropTypes.number.isRequired,
    /** The minimum scrollTop position where the transform should start */
    pinStart: PropTypes.number.isRequired,
    /** Gets rendered with a corresponding stickyTop prop as an ancestor */
    stickyAncestor: PropTypes.node,
    /** Used for rendering stickyTop position of stickyAncestor */
    height: PropTypes.number,
    /** Fired, when Headroom changes its state. Passes stickyTop of the ancestor. */
    onStickyTopChanged: PropTypes.func,
    /** True, if sticky position should be disabled (e.g. for edge 16 support) */
    positionStickyDisabled: PropTypes.bool
  }

  static defaultProps = {
    pinStart: 0
  }

  state = {mode: STATIC, transition: false}

  /** the very last scrollTop which we know about (to determine direction changes) */
  lastKnownScrollTop = 0

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

  componentDidMount () {
    window.addEventListener('scroll', this.handleEvent)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleEvent)
  }

  /**
   * If we're already static and pinStart + scrollHeight >= scrollTop, then we should stay static.
   * If we're not already static, then we should set the header static, only when pinStart >= scrollTop (regardless of
   * scrollHeight, so the header doesn't jump up, when scrolling upwards to the trigger).
   * Else we shouldn't set it static.
   * @param scrollTop the currentScrollTop position
   * @returns {boolean} if we should set the header static
   */
  shouldSetStatic (scrollTop) {
    if (this.state.mode === STATIC) {
      return this.props.pinStart + this.props.scrollHeight >= scrollTop
    } else {
      return this.props.pinStart >= scrollTop
    }
  }

  /**
   * Determines the mode depending on the scrollTop position and the current direction
   * @param {number} scrollTop
   * @param {string} direction
   * @returns {string} the next mode of Headroom
   */
  determineMode (scrollTop, direction) {
    if (this.shouldSetStatic(scrollTop)) {
      return STATIC
    } else {
      return direction === UPWARDS ? PINNED : UNPINNED
    }
  }

  /**
   * @returns {boolean} if we should activate css transition animations for the transform property
   */
  shouldTransition (mode, direction) {
    // If mode is static, then no transition, because we're already in the right spot
    // (and want to change transform and top properties seamlessly)
    if (mode === STATIC) {
      return false
    }
    // mode is not static, transition when moving upwards or when we've lastly did the transition
    return direction === UPWARDS || this.state.transition
  }

  /**
   * Checks the current scrollTop position and updates the state accordingly
   */
  update = () => {
    const currentScrollTop = Headroom.getScrollTop()
    if (currentScrollTop === this.lastKnownScrollTop) {
      return
    }
    const direction = this.lastKnownScrollTop < currentScrollTop ? DOWNWARDS : UPWARDS
    const mode = this.determineMode(currentScrollTop, direction)
    const transition = this.shouldTransition(mode, direction)
    if (this.props.onStickyTopChanged && mode !== this.state.mode) {
      const {onStickyTopChanged, height, scrollHeight} = this.props
      onStickyTopChanged(Headroom.calcStickyTop(mode, height, scrollHeight))
    }
    this.setState({mode, transition})
    this.lastKnownScrollTop = currentScrollTop
  }

  handleEvent = () => {
    window.requestAnimationFrame(this.update)
  }

  static calcStickyTop (mode, height, scrollHeight) {
    return mode === PINNED ? height : height - scrollHeight
  }

  render () {
    const {stickyAncestor, children, height, scrollHeight, positionStickyDisabled} = this.props
    const {mode, transition} = this.state
    const transform = mode === UNPINNED ? -scrollHeight : 0
    const stickyTop = Headroom.calcStickyTop(mode, height, scrollHeight)
    const ownStickyTop = mode === STATIC ? -scrollHeight : 0
    return <React.Fragment>
      <HeaderWrapper translateY={transform}
                     top={ownStickyTop}
                     transition={transition}
                     positionStickyDisabled={positionStickyDisabled}
                     static={mode === STATIC}>
        {children}
      </HeaderWrapper>
      {stickyAncestor && React.cloneElement(stickyAncestor, {stickyTop})}
    </React.Fragment>
  }
}

export default Headroom
