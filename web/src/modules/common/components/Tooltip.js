// @flow

import * as React from 'react'
import styled, { css } from 'styled-components'
import dimensions from '../../theme/constants/dimensions'
import Platform from '../../platform/Platform'

// Works for Chrome > 69, Firefox > 41, RTL/LTR support does not work for IE
const toLogicalProperty = (prop: string): string => {
  if (!new Platform().supportsLogicalProperties) {
    return prop
  }

  switch (prop) {
    case 'right':
      return 'inset-inline-end'
    case 'left':
      return 'inset-inline-start'
    case 'border-left-width':
      return 'border-inline-start-width'
    case 'border-right-width':
      return 'border-inline-end-width'
    case 'border-left-color':
      return 'border-inline-start-color'
    case 'border-right-color':
      return 'border-inline-end-color'
  }

  throw Error('Unknown property.')
}

type FlowType = 'left' | 'right' | 'up' | 'down'

const pseudosMixin = (flow: FlowType) => {
  return css`
      /* CSS Triangle: https://css-tricks.com/snippets/css/css-triangle/ */
      ::before {
      ${flow === 'up' && `
          bottom: 100%;
          border-bottom-width: 0;
          border-top-color: #333;
      `}
      ${flow === 'down' && `
          top: 100%;
          border-top-width: 0;
          border-bottom-color: #333;
      `}
      ${flow === 'left' && `
          ${toLogicalProperty('border-right-width')}: 0;
          ${toLogicalProperty('border-left-color')}: #333;
          ${toLogicalProperty('left')}: -5px;
      `}
      ${flow === 'right' && `
          ${toLogicalProperty('border-left-width')}: 0;
          ${toLogicalProperty('border-right-color')}: #333 ;
          ${toLogicalProperty('right')}: -5px;
      `}
      }
  
      ::after {
      ${flow === 'up' && `
          bottom: calc(99% + 5px);
      `}
      ${flow === 'down' && `
          top: calc(99% + 5px);
      `}
      ${flow === 'left' && `
          ${toLogicalProperty('right')}: calc(99% + 5px);
      `}
      ${flow === 'right' && `
          ${toLogicalProperty('left')}: calc(99% + 5px);
      `}
      }
  
      ::before,
      ::after {
      ${(flow === 'left' || flow === 'right') && `
          top: 50%;
          transform: translate(0, -50%);
      `}
      ${(flow === 'up' || flow === 'down') && `
          left: 50%;
          transform: translate(-50%, 0);
      `}
      }
  `
}

const TooltipContainer = styled.div`
   position: relative;
  
  ::before,
  ::after {
      line-height: 1;
      user-select: none;
      pointer-events: none;
      position: absolute;
      display: none;
      opacity: 0;
   
      /* opinions */
      text-transform: none; 
      font-size: 16px;
  }

  ::before {
      content: '';
      z-index: 1001;
      border: 5px solid transparent;
  }
  ::after {
      content: '${props => props.text}';
      z-index: 1000;

      /* 
      Content settings
      */
      text-align: center;
      min-width: 3em;
      max-width: 21em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
       
      /* visible design of the tooltip bubbles */
      padding: 1ch 1.5ch;
      border-radius: .3ch;
      box-shadow: 0 1em 2em -.5em rgba(0, 0, 0, 0.35);
      background: #333;
      color: #fff;
  }
  
  :hover::before,
  :hover::after {
      display: block;
  }

  /* over 1100px */
  @media ${dimensions.minMaxWidth} {
    ${props => pseudosMixin(props.flow)}
  }
  /* below 750px */
  @media screen and ${dimensions.smallViewport} {
    ${props => pseudosMixin(props.smallViewport)}
  }
  /* inbetween */
  @media screen and ${dimensions.mediumViewport} {
    ${props => pseudosMixin(props.lowWidthFallback)}
  }
  
  @keyframes tooltips {
    to {
      opacity: 1;
    }
  }
  
  :hover::before,
  :hover::after {
      animation: tooltips 300ms ease-out forwards;
  }
`

type PropsType = {|
  children: React.Node,
  text: ?string,
  flow: FlowType,
  mediumViewportFlow?: FlowType,
  smallViewportFlow?: FlowType
|}

export default ({ children, text, flow, mediumViewportFlow, smallViewportFlow }: PropsType) => {
  if (!text) {
    return children
  }

  return <TooltipContainer text={text} flow={flow}
                           lowWidthFallback={mediumViewportFlow ?? flow}
                           smallViewport={smallViewportFlow ?? (mediumViewportFlow ?? flow)}>
      {children}
  </TooltipContainer>
}
