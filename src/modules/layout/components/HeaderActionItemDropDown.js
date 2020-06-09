// @flow

import * as React from 'react'
import onClickOutside from 'react-onclickoutside'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'

export const StyledButton = styled.button`
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  border: none;
`

export const DropDownContainer = styled.div`
  position: absolute;
  top: ${props => props.theme.dimensions.headerHeightLarge}px;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  opacity: ${props => props.active ? '1' : '0'};

  transform: scale(${props => props.active ? '1' : '0.9'});
  transform-origin: center top;
  justify-content: center;
  box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, opacity 0.2s, visibility 0s ${props => props.active ? '0s' : '0.2s'};
  background-color: ${props => props.theme.colors.backgroundColor};
  visibility: ${props => props.active ? 'visible' : 'hidden'};

  @media ${props => props.theme.dimensions.smallViewport} {
    top: ${props => props.theme.dimensions.headerHeightSmall}px;
  }

  @media ${props => props.theme.dimensions.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${props => props.theme.dimensions.maxWidth}px) / 2);
    padding-left: calc((100vw - ${props => props.theme.dimensions.maxWidth}px) / 2);
  }
`

type PropsType = {|
  children: React.Element<*>,
  iconSrc: string,
  text: string
|}

type StateType = {|
  dropDownActive: boolean
|}

/**
 * Designed to work as an item of a HeaderActionBar. Once clicked, the child node becomes visible right underneath the
 * Header. Once the user clicks outside, the node is hidden again. Additionally, the inner node gets a
 * closeDropDownCallback through its props to close the dropDown and hide itself.
 */
export class HeaderActionItemDropDown extends React.Component<PropsType, StateType> {
  componentDidUpdate () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  constructor (props: PropsType) {
    super(props)
    this.state = { dropDownActive: false }
    const self: any = this // https://github.com/facebook/flow/issues/5874
    self.handleClickOutside = this.handleClickOutside.bind(this)
  }

  toggleDropDown = () => {
    this.setState(prevState => ({ dropDownActive: !prevState.dropDownActive }))
  }

  closeDropDown = () => {
    if (this.state.dropDownActive) {
      this.toggleDropDown()
    }
  }

  handleClickOutside () {
    this.closeDropDown()
  }

  render () {
    const { iconSrc, text, children } = this.props
    const { dropDownActive } = this.state

    return (
      <div>
        <StyledButton selector='button' data-tip={text} aria-label={text} onClick={this.toggleDropDown}>
          <img alt='' src={iconSrc} />
        </StyledButton>
        <DropDownContainer active={dropDownActive}>
          {React.cloneElement(children, {
            closeDropDownCallback: this.closeDropDown
          })}
        </DropDownContainer>
      </div>
    )
  }
}

export default onClickOutside<PropsType, HeaderActionItemDropDown>(HeaderActionItemDropDown)
