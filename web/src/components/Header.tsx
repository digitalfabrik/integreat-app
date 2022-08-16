import Headroom from '@integreat-app/react-sticky-headroom'
import React, { ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { UiDirectionType } from 'translations'

import iconArrowBack from '../assets/IconArrowBack.svg'
import iconArrowForward from '../assets/IconArrowForward.svg'
import dimensions from '../constants/dimensions'
import HeaderLogo from './HeaderLogo'
import HeaderTitle from './HeaderTitle'
import KebabMenu from './KebabMenu'

type PropsType = {
  navigationItems: Array<ReactNode>
  actionItems: Array<ReactNode>
  kebabItems: Array<ReactNode>
  logoHref: string
  viewportSmall: boolean
  cityName?: string
  direction: UiDirectionType
}

const HeaderContainer = styled.header`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  user-select: none;
  flex-direction: column;
  overflow: visible;

  @media ${dimensions.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${dimensions.maxWidth}px) / 2);
    padding-left: calc((100vw - ${dimensions.maxWidth}px) / 2);
    box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
  }
`

const Row = styled.div<{ hasTitle?: boolean }>`
  display: flex;
  flex: 1;
  max-width: 100%;
  align-items: stretch;
  min-height: ${dimensions.headerHeightLarge}px;
  flex-direction: row;

  :first-child {
    z-index: 1; /* Necessary to make the LanguageFlyout cover the NavigationItems as they have opacity set */
  }

  @media ${dimensions.smallViewport} {
    background-color: ${props => props.theme.colors.backgroundAccentColor};
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: ${dimensions.headerHeightSmall}px;
    overflow-x: auto;
    padding: 16px 0;
    box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
    :first-child {
      box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.12);
      padding: 0px 4px;
    }
  }
`

const HeaderSeparator = styled.div`
  align-self: center;
  height: ${dimensions.headerHeightLarge / 2}px;
  width: 2px;
  margin: 0 5px;
  background-color: ${props => props.theme.colors.textDecorationColor};
  order: 2;

  @media ${dimensions.smallViewport} {
    display: none;
  }
`

const ActionBar = styled.nav`
  order: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media ${dimensions.smallViewport} {
    order: 2;
    flex: 1 1 0%; /* The % unit is necessary for IE11 */
  }
`

const NavigationBar = styled.nav`
  display: flex;
  flex: 1 1 0%; /* The % unit is necessary for IE11 */
  align-items: stretch;
  justify-content: center;
  @media ${dimensions.mediumLargeViewport} {
    padding: 0 10px;
  }
`

const ScrollContainer = styled.div`
  display: flex;
`

const Arrow = styled.img<{ direction: string; disabled: boolean }>`
  width: 12px;
  height: 10px;
  flex-shrink: 0;
  padding: 0 8px;
  object-fit: contain;
  align-self: center;

  ${props =>
    props.direction === 'rtl' &&
    css`
      transform: scaleX(-1);
    `}
  ${props =>
    props.disabled &&
    css`
      opacity: 0;
    `}
`

const Button = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;
`

/**
 * The standard header which can supplied to a Layout. Displays a logo left, a HeaderMenuBar in the middle and a
 * HeaderActionBar at the right (RTL: vice versa). On small viewports the HeaderMenuBar is shown underneath the rest
 * of the Header.
 * Uses Headroom to save space when scrolling.
 */
export const Header = ({
  viewportSmall,
  actionItems = [],
  kebabItems = [],
  logoHref,
  navigationItems = [],
  cityName,
  direction,
}: PropsType): ReactElement => {
  const { headerHeightSmall, headerHeightLarge } = dimensions
  const hasNavigationBar = navigationItems.length > 0
  const height = viewportSmall
    ? (1 + (hasNavigationBar ? 1 : 0)) * headerHeightSmall
    : (1 + (hasNavigationBar ? 1 : 0)) * headerHeightLarge
  const scrollHeight = viewportSmall ? headerHeightSmall : headerHeightLarge
  const scrollContainer = useRef<any>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [showArrowRight, setShowArrowRight] = useState<boolean | null>(null)
  const [showArrowLeft, setShowArrowLeft] = useState<boolean | null>(null)

  const getScrollableWidth = (): number => {
    if (scrollContainer.current) {
      const { scrollWidth, clientWidth } = scrollContainer.current
      return scrollWidth - clientWidth
    } else {
      return 0
    }
  }

  useEffect(() => {
    if (scrollContainer.current) {
      if (scrollPosition < getScrollableWidth()) {
        setShowArrowRight(true)
      } else {
        setShowArrowRight(false)
      }
      if (scrollPosition > 0) {
        setShowArrowLeft(true)
      } else {
        setShowArrowLeft(false)
      }
    }
  }, [scrollPosition])

  // TODO move scroll logic to separate component and adjust types
  return (
    <Headroom scrollHeight={scrollHeight} height={height}>
      <HeaderContainer>
        <Row hasTitle={!!cityName}>
          <HeaderLogo link={logoHref} />
          {!viewportSmall && cityName && <HeaderSeparator />}
          {(!viewportSmall || cityName) && <HeaderTitle>{cityName}</HeaderTitle>}
          <ActionBar>
            {actionItems}
            {viewportSmall && <KebabMenu items={kebabItems} direction={direction} />}
          </ActionBar>
        </Row>
        {hasNavigationBar && (
          <ScrollContainer>
            <Button disabled={!showArrowLeft} onClick={() => scrollContainer.current?.scroll({ left: 0 })}>
              <Arrow src={iconArrowBack} direction={direction} disabled={!showArrowLeft} />
            </Button>
            <Row ref={scrollContainer} onScroll={(e: any) => setScrollPosition(Math.abs(e.target.scrollLeft))}>
              <NavigationBar>{navigationItems}</NavigationBar>
            </Row>
            <Button
              disabled={!showArrowRight}
              onClick={() => {
                scrollContainer.current?.scroll({
                  left:
                    direction === 'rtl' ? -scrollContainer.current?.scrollWidth : scrollContainer.current?.scrollWidth,
                })
              }}>
              <Arrow src={iconArrowForward} direction={direction} disabled={!showArrowRight} />
            </Button>
          </ScrollContainer>
        )}
      </HeaderContainer>
    </Headroom>
  )
}

export default Header
