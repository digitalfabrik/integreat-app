import React, { ReactElement, ReactNode, RefObject, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { UiDirectionType } from 'translations/src'

import iconArrowBack from '../assets/IconArrowBack.svg'
import iconArrowForward from '../assets/IconArrowForward.svg'
import dimensions from '../constants/dimensions'

type PropsType = {
  children: ReactNode
  direction?: UiDirectionType
  scrollContainer: RefObject<HTMLDivElement>
}

const Container = styled.div`
  display: flex;
`

const Arrow = styled.img<{ direction?: string; visible: boolean }>`
  width: 12px;
  height: 10px;
  padding: 0 8px;
  align-self: center;
  opacity: 0;

  ${props =>
    props.direction === 'rtl' &&
    css`
      transform: scaleX(-1);
    `}
  ${props =>
    props.visible &&
    css`
      opacity: 1;
    `}
`

const Button = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;
`

const ScrollContainer = styled.div`
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
    padding: 8px 0;
  }
`

const getScrollableWidth = (scrollContainer: RefObject<HTMLDivElement>): number => {
  if (scrollContainer.current) {
    const { scrollWidth, clientWidth } = scrollContainer.current
    return scrollWidth - clientWidth
  }
  return 0
}

const NavigationBarScrollContainer = ({ children, direction, scrollContainer }: PropsType): ReactElement => {
  const [showArrowRight, setShowArrowRight] = useState<boolean>(false)
  const [showArrowLeft, setShowArrowLeft] = useState<boolean>(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    if (scrollContainer.current) {
      setShowArrowRight(scrollPosition < getScrollableWidth(scrollContainer))
      setShowArrowLeft(scrollPosition > 0)
    }
  }, [scrollContainer, scrollPosition])

  return (
    <Container>
      <Button disabled={!showArrowLeft} onClick={() => scrollContainer.current?.scroll({ left: 0 })}>
        <Arrow src={iconArrowBack} direction={direction} visible={showArrowLeft} alt='' />
      </Button>
      <ScrollContainer
        ref={scrollContainer}
        onScroll={(e: React.UIEvent<HTMLElement>) => setScrollPosition(Math.abs(e.currentTarget.scrollLeft))}>
        {children}
      </ScrollContainer>
      <Button
        disabled={!showArrowRight}
        onClick={() => {
          scrollContainer.current?.scroll({
            left: direction === 'rtl' ? -scrollContainer.current.scrollWidth : scrollContainer.current.scrollWidth,
          })
        }}>
        <Arrow src={iconArrowForward} direction={direction} visible={showArrowRight} alt='' />
      </Button>
    </Container>
  )
}

export default NavigationBarScrollContainer
