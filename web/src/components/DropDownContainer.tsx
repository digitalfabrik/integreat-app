import styled from 'styled-components'

import dimensions from '../constants/dimensions'

const DropDownContainer = styled.div<{ active: boolean; height?: number }>`
  position: absolute;
  top: ${dimensions.headerHeightLarge}px;
  inset-inline-end: 0;
  width: 100%;
  box-sizing: border-box;
  opacity: ${props => (props.active ? '1' : '0')};
  z-index: 1; /* this is only necessary for IE11 to have the DropDown above NavigationItems */
  transform: scale(${props => (props.active ? '1' : '0.9')});
  transform-origin: center top;
  justify-content: center;
  box-shadow: 0 2px 5px -3px rgb(0 0 0 / 20%);
  transition:
    transform 0.2s,
    opacity 0.2s,
    visibility 0s ${props => (props.active ? '0s' : '0.2s')};
  background-color: ${props => props.theme.colors.backgroundColor};
  visibility: ${props => (props.active ? 'visible' : 'hidden')};

  @media ${dimensions.smallViewport} {
    top: ${dimensions.headerHeightSmall}px;
    height: ${props => (props.height === undefined ? '100%;' : `${props.height}px;`)};
    overflow: hidden auto;
  }

  @media ${dimensions.minMaxWidth} {
    padding-inline: calc((100vw - ${dimensions.maxWidth}px) / 2) calc((200% - 100vw - ${dimensions.maxWidth}px) / 2);
  }
`

export default DropDownContainer
