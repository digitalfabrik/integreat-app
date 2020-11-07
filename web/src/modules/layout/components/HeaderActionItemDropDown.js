// @flow

import * as React from 'react'
import onClickOutside from 'react-onclickoutside'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import type { ThemeType } from '../../theme/constants/theme'

export const Container = styled.div`
  width: calc(0.8 * ${props => props.theme.dimensions.web.headerHeightLarge}px);
  height: calc(0.8 * ${props => props.theme.dimensions.web.headerHeightLarge}px);
  box-sizing: border-box;

  @media ${props => props.theme.dimensions.web.smallViewport} {
    width: calc(0.8 * ${props => props.theme.dimensions.web.headerHeightSmall}px);
    height: calc(0.8 * ${props => props.theme.dimensions.web.headerHeightSmall}px);
  }

  & > button {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    cursor: pointer;
    background-color: ${props => props.theme.colors.backgroundAccentColor};
    border: none;

  }

  & > button > img {
    box-sizing: border-box;
    padding: 22%;
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`

export const DropDownContainer = styled.div`
  position: absolute;
  top: ${props => props.theme.dimensions.web.headerHeightLarge}px;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  opacity: ${props => props.active ? '1' : '0'};
  z-index: 1; /* this is only necessary for IE11 to have the DropDown above NavigationItems */

  transform: scale(${props => props.active ? '1' : '0.9'});
  transform-origin: center top;
  justify-content: center;
  box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, opacity 0.2s, visibility 0s ${props => props.active ? '0s' : '0.2s'};
  background-color: ${props => props.theme.colors.backgroundColor};
  visibility: ${props => props.active ? 'visible' : 'hidden'};

  @media ${props => props.theme.dimensions.web.smallViewport} {
    top: ${props => props.theme.dimensions.web.headerHeightSmall}px;
  }

  @media ${props => props.theme.dimensions.web.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${props => props.theme.dimensions.web.maxWidth}px) / 2);
    padding-left: calc((100vw - ${props => props.theme.dimensions.web.maxWidth}px) / 2);
  }
`

type PropsType = {|
  children: React.Element<*>,
  theme: ThemeType,
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
  }

  toggleDropDown = () => {
    this.setState(prevState => ({ dropDownActive: !prevState.dropDownActive }))
  }

  closeDropDown = () => {
    if (this.state.dropDownActive) {
      this.toggleDropDown()
    }
  }

  handleClickOutside = () => {
    this.closeDropDown()
  }

  render () {
    const { iconSrc, text, children, theme } = this.props
    const { dropDownActive } = this.state

    return (
      <Container theme={theme}>
        <button selector='button' data-tip={text} data-event='mouseover' data-event-off='click mouseout' aria-label={text} onClick={this.toggleDropDown}>
          <img alt='' src={iconSrc} />
        </button>
        <DropDownContainer active={dropDownActive} theme={theme}>
          {React.cloneElement(children, {
            closeDropDownCallback: this.closeDropDown
          })}
        </DropDownContainer>
      </Container>
    )
  }
}

export default onClickOutside<PropsType, HeaderActionItemDropDown>(HeaderActionItemDropDown)
