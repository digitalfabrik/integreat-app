import React, { ReactElement, ReactNode, useImperativeHandle, useRef, useState } from 'react'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import { SpringEvent } from 'react-spring-bottom-sheet/dist/types'
import styled, { useTheme } from 'styled-components'

import { UiDirectionType } from 'translations'

import '../styles/BottomActionSheet.css'
import { getSnapPoints } from '../utils/getSnapPoints'
import { RichLayout } from './Layout'
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

const StyledLayout = styled(RichLayout)`
  min-height: unset;
`

type BottomActionSheetProps = {
  title?: string
  children: ReactNode
  toolbar: ReactNode
  sibling: ReactNode
  direction: UiDirectionType
  setBottomActionSheetHeight: (height: number) => void
}

export type ScrollableBottomSheetRef = {
  scrollElement: HTMLElement | null
  sheet?: BottomSheetRef | null
}

const BottomActionSheet = React.forwardRef(
  (
    { title, children, toolbar, sibling, direction, setBottomActionSheetHeight }: BottomActionSheetProps,
    ref: React.Ref<ScrollableBottomSheetRef>,
  ): ReactElement => {
    const theme = useTheme()
    const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null)
    const bottomSheetRef = useRef<BottomSheetRef>(null)
    useImperativeHandle(
      ref,
      () => ({
        sheet: bottomSheetRef.current,
        scrollElement,
      }),
      [bottomSheetRef, scrollElement],
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
        sibling={sibling}
        scrollLocking={false}
        blocking={false}
        id='sheet'
        onSpringStart={initializeScrollElement}
        onSpringEnd={() => {
          setBottomActionSheetHeight(bottomSheetRef.current?.height ?? 0)
        }}
        header={title ? <Title>{title}</Title> : null}
        snapPoints={({ maxHeight }) => getSnapPoints(maxHeight)}
        // snapPoints have been supplied in the previous line
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        defaultSnap={({ snapPoints }) => snapPoints[1]!}>
        <StyledLayout>
          {children}
          <StyledSpacer borderColor={theme.colors.borderColor} />
          <ToolbarContainer>{toolbar}</ToolbarContainer>
        </StyledLayout>
      </StyledBottomSheet>
    )
  },
)

export default BottomActionSheet
