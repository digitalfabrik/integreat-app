import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import style from './Headroom.css'

const UPWARDS = 'up'
const DOWNWARDS = 'down'

const UNPINNED = 'unpinned'
const PINNED = 'pinned'
const STATIC = 'static'

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
    this.state = {mode: STATIC, transition: false}
    this.lastKnownScrollTop = 0 // the very last scrollTop which we know about (to determine direction changes)
    this.direction = DOWNWARDS // the current direction that the user is scrolling into
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleEvent)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleEvent)
  }

  calcStatic (scrollTop) {
    if (this.state.mode === STATIC) {
      return this.props.pinStart + this.props.scrollHeight >= scrollTop
    } else {
      return this.props.pinStart >= scrollTop
    }
  }

  /**
   * Calculates the new transform and stickyTop value and updates the state
   */
  update () {
    const currentScrollTop = Headroom.getScrollTop()
    if (this.lastKnownScrollTop === currentScrollTop) return
    const direction = this.lastKnownScrollTop < currentScrollTop ? DOWNWARDS : UPWARDS
    if (this.calcStatic(currentScrollTop)) {
      this.setState({transition: false, mode: STATIC})
    } else {
      const mode = direction === UPWARDS ? PINNED : UNPINNED
      const transition = !(direction === DOWNWARDS && !this.state.transition)
      this.setState({mode, transition})
    }

    this.lastKnownScrollTop = currentScrollTop
  }

  handleEvent () {
    window.requestAnimationFrame(this.update)
  }

  render () {
    const {stickyAncestor, children} = this.props
    const {mode, transition} = this.state
    const stickyTop = mode === PINNED ? this.props.height : this.props.height - this.props.scrollHeight
    const transform = mode === UNPINNED ? -this.props.scrollHeight : 0
    const ownStickyTop = mode === STATIC ? -this.props.scrollHeight : 0
    return <React.Fragment>
      <div
        style={{transform: `translateY(${transform}px)`, top: `${ownStickyTop}px`}}
        className={cx({
          [style.headroom]: true,
          [style.transition]: transition,
          [style.static]: mode === STATIC
        })}>
        {children}
      </div>
      {stickyAncestor && React.cloneElement(stickyAncestor, {stickyTop})}
    </React.Fragment>
  }
}

export default Headroom
