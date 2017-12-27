import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import style from './HeaderDropDown.css'
import headerStyle from '../containers/Header.css'
import onClickOutside from 'react-onclickoutside'

class HeaderDropDown extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    iconSrc: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {dropDownActive: false}
    this.toggleDropDown = this.toggleDropDown.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  toggleDropDown () {
    this.setState({dropDownActive: !this.state.dropDownActive})
  }

  handleClickOutside () {
    if (this.state.dropDownActive) {
      this.toggleDropDown()
    }
  }

  render () {
    return (
      <span className={cx(this.props.className, headerStyle.actionItem)}>
        <img src={this.props.iconSrc}
             onClick={this.toggleDropDown} />
        <div className={cx(style.dropDown, this.state.dropDownActive ? style.dropDownActive : '')}>
          {
            // Pass DropDownCallback as prop to children
            React.Children.map(this.props.children,
              child => React.cloneElement(child, {
                closeDropDownCallback: this.handleClickOutside
              }))
          }
        </div>
      </span>
    )
  }
}

export default onClickOutside(HeaderDropDown)
