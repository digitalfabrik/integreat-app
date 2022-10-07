import React, { ReactElement, ReactNode, RefObject, useCallback, useState } from 'react'
import styled from 'styled-components'

import { UiDirectionType } from 'translations/src'

import iconArrowBack from '../assets/IconArrowBack.svg'
import iconArrowForward from '../assets/IconArrowForward.svg'
import dimensions from '../constants/dimensions'
import useCallbackRef from '../hooks/useCallbackRef'
import useWindowDimensions from '../hooks/useWindowDimensions'

type PropsType = {
  children: ReactNode
  direction?: UiDirectionType
  activeIndex: number
}

const Container = styled.div`
  display: flex;
  padding: 4px 0;
`

const Arrow = styled.img<{ direction?: string; visible: boolean }>`
  width: 12px;
  height: 10px;
  padding: 0 8px;
  align-self: center;
  opacity: ${props => (props.visible ? 1 : 0)};
  transform: ${props => (props.direction === 'rtl' ? 'scaleX(-1)' : '')};
`

const Button = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;
`

const ScrollContainer = styled.div<{ showArrowContainer: boolean }>`
  display: flex;
  flex: 1;
  max-width: 100%;
  align-items: stretch;
  min-height: ${dimensions.headerHeightLarge}px;
  flex-direction: row;

  @media ${dimensions.smallViewport} {
    background-color: ${props => props.theme.colors.backgroundAccentColor};
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: ${dimensions.headerHeightSmall}px;
    overflow-x: auto;
    padding: ${props => (props.showArrowContainer ? '8px 0' : '8px')};
  }
`

const getInitialScrollPosition = (activeIndex: number): number => {
  const navigationBar = document.getElementById('navigation-bar')
  if (!navigationBar || activeIndex === 0) {
    return 0
  }
  const navigationBarOffset = navigationBar.offsetLeft
  const elementOffset = navigationBar.getElementsByTagName('div')[activeIndex]?.offsetLeft
  return elementOffset ? navigationBarOffset + elementOffset : 0
}

const NavigationBarScrollContainer = ({ children, direction, activeIndex }: PropsType): ReactElement => {
  const { width } = useWindowDimensions()
  const [scrollPosition, setScrollPosition] = useState<number>(0)
  const scrollToActiveItem = useCallback(
    (ref: RefObject<HTMLDivElement>) => {
      ref.current?.scroll({ left: getInitialScrollPosition(activeIndex) })
    },
    [activeIndex]
  )
  const { ref, current: scrollContainer } = useCallbackRef(scrollToActiveItem)
  const scrollableWidth = scrollContainer ? scrollContainer.scrollWidth - scrollContainer.clientWidth : 0

  const showArrowContainer = scrollContainer ? scrollContainer.scrollWidth > width : false
  const showArrowLeft = scrollContainer ? scrollPosition > 0 : false
  const showArrowRight = scrollContainer ? scrollPosition < scrollableWidth : false

  const scrollToEnd = () =>
    scrollContainer?.scroll({ left: direction === 'rtl' ? -scrollContainer.scrollWidth : scrollContainer.scrollWidth })

  const scrollToStart = () => scrollContainer?.scroll({ left: 0 })

  const Content = (
    <ScrollContainer
      ref={ref}
      showArrowContainer={showArrowContainer}
      onScroll={(e: React.UIEvent<HTMLElement>) => setScrollPosition(Math.abs(e.currentTarget.scrollLeft))}>
      {children}
    </ScrollContainer>
  )

  if (!showArrowContainer) {
    return <Container>{Content}</Container>
  }

  return (
    <Container>
      <Button disabled={!showArrowLeft} onClick={scrollToStart}>
        <Arrow src={iconArrowBack} direction={direction} visible={showArrowLeft} alt='' />
      </Button>
      {Content}
      <Button disabled={!showArrowRight} onClick={scrollToEnd}>
        <Arrow src={iconArrowForward} direction={direction} visible={showArrowRight} alt='' />
      </Button>
    </Container>
  )
}

export default NavigationBarScrollContainer
