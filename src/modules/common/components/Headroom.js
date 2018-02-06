import React from 'react'
import PropTypes from 'prop-types'
import raf from 'raf'

import style from './Headroom.css'

class Headroom extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    scrollHeight: PropTypes.number.isRequired,
    pinStart: PropTypes.number.isRequired,
    stickyAncestor: PropTypes.node,
    height: PropTypes.number
  }

  static defaultProps = {
    pinStart: 0
  }

  constructor (props) {
    super(props)
    this.handleEvent = this.handleEvent.bind(this)
    this.update = this.update.bind(this)
    this.ticking = false
    this.lastScrollY = 0
    this.lastTransform = 0
    this.lastKnownScrollY = 0
    this.currentScrollY = 0
    this.direction = 'down'
    this.state = {transform: 0}
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleEvent)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll touchstart touchmove', this.handleEvent)
  }

  getScrollY = () => {
    if (window.pageYOffset !== undefined) {
      return window.pageYOffset
    } else if (window.scrollTop !== undefined) {
      return window.scrollTop
    } else {
      return (document.documentElement || document.body.parentNode || document.body).scrollTop
    }
  }

  truncate (transform, currentScrollY) {
    if (transform + currentScrollY < this.props.pinStart) {
      return 0
    }
    return Math.min(0, Math.max(-this.props.scrollHeight, transform))
  }

  update () {
    // this.lastScrollY: ScrollTop when the scroll direction last changed
    // this.lastTransform: Transform when the scroll direction last changed
    // this.lastKnownScrollY: Last ScrollTop (to detect change in scroll direction)
    // this.currentScrollY: Current ScrollTop
    // this.direction: 'up' || 'down'

    this.currentScrollY = this.getScrollY()
    if (this.lastKnownScrollY < this.currentScrollY) { // We're moving up
      if (this.direction !== 'up') { // We've changed direction from down to up!
        this.lastTransform = this.state.transform
        this.lastScrollY = this.lastKnownScrollY
        this.direction = 'down'
      }
    } else if (this.lastKnownScrollY > this.currentScrollY) { // We're moving down
      if (this.direction !== 'down') { // We've changed direction from up to down!
        this.lastTransform = this.state.transform
        this.lastScrollY = this.lastKnownScrollY
        this.direction = 'up'
      }
    }
    this.lastKnownScrollY = this.currentScrollY
    const newTransform = this.truncate(this.lastTransform + (this.lastScrollY - this.currentScrollY), this.currentScrollY)
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
