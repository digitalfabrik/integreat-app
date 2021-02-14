// @flow

import * as React from 'react'
import styled, { css } from 'styled-components'
import dimensions from '../../theme/constants/dimensions'
import Platform from '../../platform/Platform'

// Works for Chrome > 69, Firefox > 41, RTL/LTR does not work for IE

const pseudosMixin = (flow: 'up' | 'down' | 'left' | 'right') => css`
    
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
        border-inline-end-width: 0;
        border-inline-start-color: #333;
        inset-inline-start: -5px;
    `}
    ${flow === 'right' && `
        border-inline-start-width: 0;
        border-inline-end-color: #333 ;
        inset-inline-end: -5px;
    `}
    }

    ::after {
    ${flow === 'up' && `
        bottom: calc(97% + 5px);
    `}
    ${flow === 'down' && `
        top: calc(97% + 5px);
    `}
    ${flow === 'left' && `
        inset-inline-end: calc(97% + 5px);
    `}
    ${flow === 'right' && `
        inset-inline-start: calc(97% + 5px);
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
       
      /* most of the rest of this is opinion */
      text-align: center;
       
      /* 
      Let the content set the size of the tooltips 
      but this will also keep them from being obnoxious
      */
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
  @media screen and (min-width: 750px) and (max-width: 1100px) {
    ${props => pseudosMixin(props.lowWidthFallback)}
  }
  
  
  @keyframes tooltips {
    to {
      opacity: .9;
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
  direction: 'up' | 'down',
  lowWidthFallback?: 'left' | 'right' | 'up' | 'down',
  smallViewport?: 'left' | 'right' | 'up' | 'down'
|}

export default ({ children, text, direction, lowWidthFallback, smallViewport }: PropsType) => {
  if (!text) {
    return children
  }

  if (!new Platform().supportsLogicalProperties()) {
    return children
  }

  return <TooltipContainer text={text} flow={direction}
                           lowWidthFallback={lowWidthFallback ?? direction}
                           smallViewport={smallViewport ?? (lowWidthFallback ?? direction)}>
    {children}
  </TooltipContainer>
}
