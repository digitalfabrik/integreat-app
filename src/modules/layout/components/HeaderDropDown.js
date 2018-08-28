// @flow

import * as React from 'react'
import cx from 'classnames'
import style from './HeaderDropDown.css'
import onClickOutside from 'react-onclickoutside'

type PropsType = {
  children: React.Element<*>,
  iconSrc: string
}

type StateType = {
  dropDownActive: boolean
}

/**
 * Designed to work as an item of a HeaderActionBar. Once clicked, the child node becomes visible right underneath the
 * Header. Once the user clicks outside, the node is hidden again. Additionally, the inner node gets a
 * closeDropDownCallback through its props to close the dropDown and hide itself.
 */
class HeaderDropDown extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = { dropDownActive: false }
    const self: any = this // https://github.com/facebook/flow/issues/5874
    self.handleClickOutside = this.handleClickOutside.bind(this)
    self.toggleDropDown = this.toggleDropDown.bind(this)
    self.closeDropDown = this.closeDropDown.bind(this)
  }

  toggleDropDown () {
    this.setState(prevState => ({ dropDownActive: !prevState.dropDownActive }))
  }

  closeDropDown () {
    if (this.state.dropDownActive) {
      this.toggleDropDown()
    }
  }

  handleClickOutside () {
    this.closeDropDown()
  }

  render () {
    return (
      <span>
        <img src={this.props.iconSrc} onClick={this.toggleDropDown} />
        <div
          className={cx(
            style.dropDown,
            this.state.dropDownActive ? style.dropDownActive : ''
          )}
        >
          {/* Pass dropDownCallback to child element */}
          {React.cloneElement(this.props.children, {
            closeDropDownCallback: this.closeDropDown
          })}
        </div>
      </span>
    )
  }
}

export default onClickOutside(HeaderDropDown)
