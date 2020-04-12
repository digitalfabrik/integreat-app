// @flow

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Tab from './Tab'

const StyledTabs = styled.div`
  display: flex;
  padding-top: 45px;
  padding-bottom: 40px;
`

type PropsType = {|
  children: Array<React.Node>
|}

type StateType = {|
  activeTab: string
|}

class Tabs extends React.PureComponent<PropsType, StateType> {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      activeTab: this.props.children[0].props.label
    }
  }

  onClickTabItem = (tab: string) => {
    this.setState({ activeTab: tab })
  }

  render () {
    const {
      onClickTabItem,
      props: { children },
      state: { activeTab }
    } = this

    return (
      <>
        <StyledTabs>
          {children.map(child => {
            const { label, type } = child.props
            return <Tab activeTab={activeTab} key={label} label={label} onClick={onClickTabItem} type={type} />
          })}
        </StyledTabs>
        <div>
          {children.map(child => {
            if (child.props.label !== activeTab) {
              return undefined
            }
            return child.props.children
          })}
        </div>
      </>
    )
  }
}

export default Tabs
