import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import React, { ReactElement, ReactNode, RefObject, useCallback, useState } from 'react'

import dimensions from '../constants/dimensions'
import useCallbackRef from '../hooks/useCallbackRef'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Button from './base/Button'
import Icon from './base/Icon'

type NavigationBarScrollContainerProps = {
  children: ReactNode
  activeIndex: number
}

const Container = styled.div`
  display: flex;
`

const Arrow = styled(Icon)<{ visible: boolean }>`
  width: 16px;
  height: 16px;
  padding: 0 8px;
  align-self: center;
  opacity: ${props => (props.visible ? 1 : 0)};
`

const ScrollContainer = styled.div<{ showArrowContainer: boolean }>`
  display: flex;
  flex: 1;
  max-width: 100%;
  align-items: stretch;
  box-sizing: border-box;
  min-height: ${dimensions.headerHeightLarge}px;
  flex-direction: row;

  ${props => props.theme.breakpoints.down('md')} {
    background-color: ${props => props.theme.legacy.colors.backgroundAccentColor};
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: ${dimensions.headerHeightSmall}px;
    overflow-x: auto;
    padding: ${props => (props.showArrowContainer ? '8px 0' : '8px')};
  }
`

const getActiveItemScrollPosition = (activeIndex: number): number => {
  const navigationBar = document.getElementById('navigation-bar')
  const navigationItem = navigationBar?.getElementsByClassName('header-navigation-item')[activeIndex]
  if (!navigationBar || !(navigationItem instanceof HTMLElement)) {
    return 0
  }
  return navigationItem.offsetLeft - navigationBar.offsetLeft
}

const NavigationBarScrollContainer = ({ children, activeIndex }: NavigationBarScrollContainerProps): ReactElement => {
  const { width } = useWindowDimensions()
  const [scrollPosition, setScrollPosition] = useState<number>(0)
  const scrollToActiveItem = useCallback(
    (ref: RefObject<HTMLDivElement | null>) => {
      ref.current?.scroll({ left: getActiveItemScrollPosition(activeIndex) })
    },
    [activeIndex],
  )
  const { ref, current: scrollContainer } = useCallbackRef(scrollToActiveItem)
  const scrollableWidth = scrollContainer ? scrollContainer.scrollWidth - scrollContainer.clientWidth : 0

  const showArrowContainer = scrollContainer ? scrollContainer.scrollWidth > width : false
  const showArrowLeft = scrollContainer ? scrollPosition > 0 : false
  const showArrowRight = scrollContainer ? scrollPosition < scrollableWidth : false

  const { contentDirection } = useTheme()
  const scrollToEnd = () =>
    scrollContainer?.scroll({
      left: contentDirection === 'rtl' ? -scrollContainer.scrollWidth : scrollContainer.scrollWidth,
    })

  const scrollToStart = () => scrollContainer?.scroll({ left: 0 })

  const Content = (
    <ScrollContainer
      ref={ref}
      onScroll={(e: React.UIEvent<HTMLElement>) => setScrollPosition(Math.abs(e.currentTarget.scrollLeft))}
      showArrowContainer={showArrowContainer}>
      {children}
    </ScrollContainer>
  )

  if (!showArrowContainer) {
    return <Container>{Content}</Container>
  }

  return (
    <Container>
      <Button disabled={!showArrowLeft} onClick={scrollToStart} label='' aria-hidden>
        <Arrow src={ArrowBackIosNewIcon} visible={showArrowLeft} />
      </Button>
      {Content}
      <Button disabled={!showArrowRight} onClick={scrollToEnd} label='' aria-hidden>
        <Arrow src={ArrowBackIosNewIcon} visible={showArrowRight} reverse />
      </Button>
    </Container>
  )
}

export default NavigationBarScrollContainer
