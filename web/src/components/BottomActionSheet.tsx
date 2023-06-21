import React, { createRef, ReactElement, ReactNode, useImperativeHandle, useState } from 'react'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import { SpringEvent } from 'react-spring-bottom-sheet/dist/types'
import styled, { useTheme } from 'styled-components'

import { UiDirectionType } from 'translations'

import '../styles/BottomActionSheet.css'
import { getSnapPoints } from '../utils/getSnapPoints'
import Spacer from './Spacer'

const Title = styled.h1`
  font-size: 1.25rem;
  font-family: ${props => props.theme.fonts.web.contentFont};
`

const ToolbarContainer = styled.div`
  margin-top: 16px;
`

const StyledSpacer = styled(Spacer)`
  margin: 12px 30px;
`

const StyledBottomSheet = styled(BottomSheet)<{ direction: string }>`
  direction: ${props => props.direction};
`

type BottomActionSheetProps = {
  title?: string
  children: ReactNode
  toolbar: ReactNode
  direction: UiDirectionType
  setBottomActionSheetHeight: (height: number) => void
}

export type ScrollableBottomSheetRef = {
  scrollElement: HTMLElement | null
  sheet?: BottomSheetRef | null
}

const BottomActionSheet = React.forwardRef(
  (
    { title, children, toolbar, direction, setBottomActionSheetHeight }: BottomActionSheetProps,
    ref: React.Ref<ScrollableBottomSheetRef>
  ): ReactElement => {
    const theme = useTheme()
    const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null)
    const bottomSheetRef = createRef<BottomSheetRef>()
    useImperativeHandle(
      ref,
      () => ({
        sheet: bottomSheetRef.current,
        scrollElement,
      }),
      [bottomSheetRef, scrollElement]
    )
    const initializeScrollElement = (e: SpringEvent) => {
      if (e.type === 'OPEN' && !scrollElement) {
        const scrollElement = document.querySelector('[data-rsbs-scroll]') as HTMLElement | null
        setScrollElement(scrollElement)
      }
    }

    return (
      <StyledBottomSheet
        direction={direction}
        ref={bottomSheetRef}
        open
        scrollLocking={false}
        blocking={false}
        id='sheet'
        onSpringStart={initializeScrollElement}
        onSpringEnd={() => {
          setBottomActionSheetHeight(bottomSheetRef.current?.height ?? 0)
        }}
        header={title ? <Title>{title}</Title> : null}
        snapPoints={({ maxHeight }) => getSnapPoints(maxHeight)}
        defaultSnap={({ snapPoints }) => snapPoints[1]!}>
        {children}
        <StyledSpacer borderColor={theme.colors.poiBorderColor} />
        <ToolbarContainer>{toolbar}</ToolbarContainer>
      </StyledBottomSheet>
    )
  }
)

export default BottomActionSheet
