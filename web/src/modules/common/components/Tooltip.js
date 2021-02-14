// @flow

import * as React from 'react'
import styled, { css } from 'styled-components'
import dimensions from '../../theme/constants/dimensions'

const pseudosMixin = (flow: 'up' | 'down' | 'left' | 'right') => css`
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
    ${(flow === 'left' || flow === 'right') && `
        top: 50%;
        transform: translate(0, -50%);
    `}
    ${flow === 'left' && `
        border-right-width: 0;
        border-left-color: #333;
        left: calc(0em - 5px);
    `}
    ${flow === 'right' && `
        border-left-width: 0;
        border-right-color: #333;
        right: calc(0em - 5px);
    `}
    }

    ::after {
    ${flow === 'up' && `
        bottom: calc(100% + 5px);
    `}
    ${flow === 'down' && `
        top: calc(100% + 5px);
    `}
    ${(flow === 'left' || flow === 'right') && `
        top: 50%;
        transform: translate(0, -50%);
    `}
    ${flow === 'left' && `
        right: calc(100% + 5px);
    `}
    ${flow === 'right' && `
        left: calc(100% + 5px);
    `}
    }

    ::before,
    ::after {
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


  @media not ${dimensions.minMaxWidth} {
    ${props => pseudosMixin(props.lowWidthFallback)}
  }
  @media ${dimensions.minMaxWidth} {
    ${props => pseudosMixin(props.flow)}
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
  lowWidthFallback?: 'left' | 'right'
|}

export default ({ children, text, direction, lowWidthFallback }: PropsType) => {
  if (!text) {
    return children
  }

  return <TooltipContainer text={text} flow={direction} lowWidthFallback={lowWidthFallback ?? direction}>
    {children}
  </TooltipContainer>
}
