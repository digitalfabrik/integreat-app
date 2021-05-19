import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import dimensions from '../../theme/constants/dimensions'

type FlowType = 'left' | 'right' | 'up' | 'down'

const pseudosMixin = (flow: FlowType, color: string) => css`
  /* CSS Triangle: https://css-tricks.com/snippets/css/css-triangle/ */
  ::before {
    ${flow === 'up' &&
    `
      bottom: 100%;
      border-bottom-width: 0;
      border-top-color: ${color};
    `}
    ${flow === 'down' &&
    `
      top: 100%;
      border-top-width: 0;
      border-bottom-color: ${color};
    `}
    ${flow === 'left' &&
    `
      border-right-width: 0;
      border-left-color: ${color};
      left: -5px;
    `}
    ${flow === 'right' &&
    `
      border-left-width: 0;
      border-right-color: ${color};
      right: -5px;
    `}
  }

  ::after {
    ${flow === 'up' &&
    `
      bottom: calc(99% + 5px);
    `}
    ${flow === 'down' &&
    `
      top: calc(99% + 5px);
    `}
    ${flow === 'left' &&
    `
      right: calc(99% + 5px);
    `}
    ${flow === 'right' &&
    `
      left: calc(99% + 5px);
    `}
  }

  ::before,
  ::after {
    ${(flow === 'left' || flow === 'right') &&
    `
      top: 50%;
      transform: translate(0, -50%);
    `}
    ${(flow === 'up' || flow === 'down') &&
    `
      left: 50%;
      transform: translate(-50%, 0);
    `}
  }
`

// maximum widths and heights
const MAX_HEIGHT = 50
const MAX_WIDTH = 300

const TooltipContainer = styled.div<{
  text: string
  flow: FlowType
  smallViewportFlow: FlowType
  mediumViewportFlow: FlowType
}>`
  position: relative;

  ::before,
  ::after {
    line-height: 1;
    user-select: none;
    pointer-events: none;
    position: absolute;
    display: none;
    opacity: 0;
    text-transform: none;
    font-size: 16px;
  }

  ::before {
    content: '';
    z-index: 2000;
    border: 5px solid transparent;
  }

  ::after {
    content: '${props => props.text}';
    z-index: 1000;

    /* Content props */
    text-align: center;
    min-width: 50px;
    max-width: ${MAX_WIDTH}px;
    max-height: ${MAX_HEIGHT}px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    /* visible design of the tooltip bubbles */
    padding: 10px 15px;
    border-radius: 3px;
    background: ${props => props.theme.colors.textSecondaryColor};
    color: ${props => props.theme.colors.backgroundColor};
  }

  :hover::before,
  :hover::after {
    display: block;
  }

  /* over 1100px */
  @media ${dimensions.minMaxWidth} {
    ${props => pseudosMixin(props.flow, props.theme.colors.textSecondaryColor)}
  }
  /* below 750px */
  @media screen and ${dimensions.smallViewport} {
    ${props => pseudosMixin(props.smallViewportFlow, props.theme.colors.textSecondaryColor)}
  }
  /* inbetween */
  @media screen and ${dimensions.mediumViewport} {
    ${props => pseudosMixin(props.mediumViewportFlow, props.theme.colors.textSecondaryColor)}
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

type PropsType = {
  children: ReactNode
  text: string | null
  flow: FlowType
  mediumViewportFlow?: FlowType
  smallViewportFlow?: FlowType
  className?: string
}

type ViewportDimensionsType = {
  width: number
  height: number
}

const getCenterY = (rect: ClientRect) => rect.top + rect.height / 2
const getCenterX = (rect: ClientRect) => rect.left + rect.width / 2

const spaceCheckers: Record<
  FlowType,
  {
    fallbacks: FlowType[]
    check: (element: ClientRect, dimensions: ViewportDimensionsType) => boolean
  }
> = {
  up: {
    fallbacks: ['down', 'left', 'right'],
    check: (rect: ClientRect, { width }) =>
      rect.top - MAX_HEIGHT >= 0 && // Check distance to viewport top
      getCenterX(rect) - MAX_WIDTH / 2 >= 0 && // Check distance from center to viewport left
      getCenterX(rect) + MAX_WIDTH / 2 <= width // Check distance from center to viewport right
  },
  down: {
    fallbacks: ['up', 'left', 'right'],
    check: (rect: ClientRect, { width, height }) =>
      rect.bottom + MAX_HEIGHT <= height && // Check distance to viewport bottom
      getCenterX(rect) - MAX_WIDTH / 2 >= 0 && // Check distance from center to viewport left
      getCenterX(rect) + MAX_WIDTH / 2 <= width // Check distance from center to viewport right
  },
  left: {
    fallbacks: ['right', 'up', 'left'],
    check: (rect: ClientRect, { height }) =>
      rect.left - MAX_WIDTH >= 0 && // Check distance to viewport left
      getCenterY(rect) - MAX_HEIGHT / 2 >= 0 && // Check distance from center to viewport top
      getCenterY(rect) + MAX_HEIGHT / 2 <= height // Check distance from center to viewport bottom
  },
  right: {
    fallbacks: ['left', 'up', 'left'],
    check: (rect: ClientRect, { width, height }) =>
      rect.right + MAX_WIDTH <= width && // Check distance to viewport right
      getCenterY(rect) - MAX_HEIGHT / 2 >= 0 && // Check distance from center to viewport top
      getCenterY(rect) + MAX_HEIGHT / 2 <= height // Check distance from center to viewport bottom
  }
}

const fixFlow = (element: Element | null, preferredFlow: FlowType, dimensions: ViewportDimensionsType) => {
  if (!element) {
    return preferredFlow
  }

  const checker = spaceCheckers[preferredFlow]
  if (!checker) {
    throw new Error('Fallback not found')
  }

  if (checker.check(element.getBoundingClientRect(), dimensions)) {
    return preferredFlow
  } else {
    const fallback = checker.fallbacks.find((fallbackFlow: FlowType) => {
      const fallbackChecker = spaceCheckers[fallbackFlow]
      if (!fallbackChecker) {
        throw new Error('Fallback not found')
      }
      return fallbackChecker.check(element.getBoundingClientRect(), dimensions)
    })

    return fallback ?? preferredFlow
  }
}

export default ({ children, text, flow, mediumViewportFlow, smallViewportFlow, ...props }: PropsType) => {
  const [container, setContainer] = useState<Element | null>(null)
  const onRefSet = useCallback(
    ref => {
      setContainer(ref)
    },
    [setContainer]
  )

  const [dimensions, setDimensions] = useState<ViewportDimensionsType>({
    height: window.innerHeight,
    width: window.innerWidth
  })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  })

  if (!text) {
    return children
  }

  const fixedFlow = fixFlow(container, flow, dimensions)
  const fixedMediumFlow = mediumViewportFlow ? fixFlow(container, mediumViewportFlow, dimensions) : fixedFlow
  const fixedSmallFlow = smallViewportFlow ? fixFlow(container, smallViewportFlow, dimensions) : fixedMediumFlow
  return (
    <TooltipContainer
      {...props}
      text={text}
      ref={onRefSet}
      flow={fixedFlow}
      mediumViewportFlow={fixedMediumFlow}
      smallViewportFlow={fixedSmallFlow}>
      {children}
    </TooltipContainer>
  )
}
