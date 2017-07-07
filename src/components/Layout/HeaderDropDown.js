import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import FontAwesome from 'react-fontawesome'
import style from './Header.css'
import onClickOutside from 'react-onclickoutside'

class HeaderDropDown extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    fontAwesome: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { dropDownActive: false }
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
      <div className={cx(this.props.className, style.dropDownItem)}>
        <FontAwesome name={this.props.fontAwesome} className={cx(this.state.dropDownActive ? style.itemActive : '', style.item)} onClick={this.toggleDropDown}/>
        <div className={cx(style.dropDown, this.state.dropDownActive ? style.dropDownActive : '')}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default onClickOutside(HeaderDropDown)
