import React, { ReactElement, ReactNode, RefObject, useState } from 'react'
import styled from 'styled-components'

import { UiDirectionType } from 'translations/src'

import iconArrowBack from '../assets/IconArrowBack.svg'
import iconArrowForward from '../assets/IconArrowForward.svg'
import dimensions from '../constants/dimensions'

type PropsType = {
  children: ReactNode
  direction?: UiDirectionType
  scrollContainerRef: RefObject<HTMLDivElement>
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

const ScrollContainer = styled.div<{ showArrows?: boolean }>`
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
    padding: ${props => (props.showArrows ? '8px 0' : '8px')};
  }
`

const getScrollableWidth = (scrollContainer: RefObject<HTMLDivElement>): number => {
  if (scrollContainer.current) {
    const { scrollWidth, clientWidth } = scrollContainer.current
    return scrollWidth - clientWidth
  }
  return 0
}

const NavigationBarScrollContainer = ({ children, direction, scrollContainerRef }: PropsType): ReactElement => {
  const [scrollPosition, setScrollPosition] = useState(0)

  const showArrows = scrollContainerRef.current ? getScrollableWidth(scrollContainerRef) > 0 : false
  const showArrowLeft = scrollContainerRef.current ? scrollPosition > 0 : false
  const showArrowRight = scrollContainerRef.current ? scrollPosition < getScrollableWidth(scrollContainerRef) : false

  const onScrollForward = () =>
    scrollContainerRef.current?.scroll({
      left: direction === 'rtl' ? -scrollContainerRef.current.scrollWidth : scrollContainerRef.current.scrollWidth,
    })

  const scrollContainer = (
    <ScrollContainer
      ref={scrollContainerRef}
      onScroll={(e: React.UIEvent<HTMLElement>) => setScrollPosition(Math.abs(e.currentTarget.scrollLeft))}
      showArrows={showArrows}>
      {children}
    </ScrollContainer>
  )

  if (!showArrows) {
    return scrollContainer
  }

  return (
    <Container>
      <Button disabled={!showArrowLeft} onClick={() => scrollContainerRef.current?.scroll({ left: 0 })}>
        <Arrow src={iconArrowBack} direction={direction} visible={showArrowLeft} alt='' />
      </Button>
      {scrollContainer}
      <Button disabled={!showArrowRight} onClick={onScrollForward}>
        <Arrow src={iconArrowForward} direction={direction} visible={showArrowRight} alt='' />
      </Button>
    </Container>
  )
}

export default NavigationBarScrollContainer
