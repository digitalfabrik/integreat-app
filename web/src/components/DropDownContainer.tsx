import styled from '@emotion/styled'

import dimensions from '../constants/dimensions'

const DropDownContainer = styled.div<{ active: boolean }>`
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
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
  visibility: ${props => (props.active ? 'visible' : 'hidden')};

  ${props => props.theme.breakpoints.down('md')} {
    top: ${dimensions.headerHeightSmall}px;
    height: calc(100% - ${dimensions.headerHeightSmall}px);
    overflow: hidden auto;
  }

  ${props => props.theme.breakpoints.up('lg')} {
    padding-inline: calc((100vw - ${props => props.theme.breakpoints.values.lg}px) / 2)
      calc((200% - 100vw - ${props => props.theme.breakpoints.values.lg}px) / 2);
  }
`

export default DropDownContainer
