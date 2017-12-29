import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import style from './HeaderDropDown.css'
import onClickOutside from 'react-onclickoutside'

class HeaderDropDown extends React.Component {
  static propTypes = {
    iconSrc: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired
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
      <span>
        <img src={this.props.iconSrc}
             onClick={this.toggleDropDown} />
        <div className={cx(style.dropDown, this.state.dropDownActive ? style.dropDownActive : '')}>
          { /* Pass dropDownCallback to child element */ }
          { React.cloneElement(this.props.children, { closeDropDownCallback: this.handleClickOutside }) }
        </div>
      </span>
    )
  }
}

export default onClickOutside(HeaderDropDown)
