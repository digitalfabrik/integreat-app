import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import { Sheet, SnapPoint } from '@nipe-solutions/react-spring-bottom-sheet'
import '@nipe-solutions/react-spring-bottom-sheet/styles.css'
import React, { ReactElement, ReactNode, RefObject, useCallback, useImperativeHandle, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { bottomSheetHandleHeight } from '../hooks/useDimensions'
import { RichLayout } from './Layout'

const StyledViewport = styled(Sheet.Viewport)`
  --rsbs-z-index: 2;
`

const StyledSheetContent = styled(Sheet.Content)`
  --integreat-map-controls-max-height: ${props => props.theme.dimensions.bottomSheet.snapPoints.medium}px;
  --rsbs-content-background: ${props => props.theme.palette.background.default};

  display: flex;
  height: 100%;
  min-height: ${bottomSheetHandleHeight}px;
  flex-direction: column;
  direction: ${props => props.theme.contentDirection};
`

const ScrollRegion = styled('div')`
  height: max(
    0px,
    calc(
      100% - var(--rsbs-position) - ${bottomSheetHandleHeight}px -
        ${props => props.theme.dimensions.bottomNavigationHeight ?? 0}px
    )
  );
  flex: none;
  margin-bottom: ${props => props.theme.dimensions.bottomNavigationHeight ?? 0}px;
  overflow-y: auto;
`

const SiblingLayer = styled('div')`
  position: absolute;
  top: max(0px, calc(100% - var(--integreat-map-controls-max-height) - var(--rsbs-position)));
  right: 0;
  left: 0;
  height: 0;
`

const StyledLayout = styled(RichLayout)`
  justify-content: flex-start;
  width: 100%;
  min-height: 100%;
  padding-bottom: ${props => props.theme.dimensions.ttsPlayerHeight}px;
`

const HeaderButton = styled(ButtonBase)`
  display: flex;
  min-height: ${bottomSheetHandleHeight}px;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  padding: ${props => props.theme.spacing(1, 2)};
  color: ${props => props.theme.palette.text.primary};

  &.rsbs-handle::before {
    content: none;
  }
`

type SheetControl = {
  snapTo: (height: number) => void
}

export type ScrollableBottomSheetRef = {
  scrollElement: HTMLElement | null
  sheet?: SheetControl | null
}

type BottomActionSheetProps = {
  children: ReactNode
  sibling: ReactNode
  title?: string
  ref: RefObject<ScrollableBottomSheetRef | null>
}

const BottomActionSheet = ({ children, sibling, title, ref }: BottomActionSheetProps): ReactElement => {
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null)
  const { dimensions, contentDirection } = useTheme()
  const { t } = useTranslation()
  const { min, medium, large, max } = dimensions.bottomSheet.snapPoints
  const [activeSnapPoint, setActiveSnapPoint] = useState('medium')
  const isFullscreen = activeSnapPoint === 'max'
  const HandleIcon = isFullscreen ? KeyboardArrowDownIcon : KeyboardArrowUpIcon

  const snapPoints: SnapPoint[] = useMemo(
    () => [
      { id: 'min', value: `${min}px` },
      { id: 'medium', value: `${medium}px` },
      { id: 'large', value: `${large}px` },
      { id: 'max', value: `${max}px` },
    ],
    [large, max, medium, min],
  )

  const snapTo = useCallback(
    (height: number) => {
      const nearest = snapPoints.reduce((current, candidate) => {
        const currentHeight = Number.parseFloat(String(current.value))
        const candidateHeight = Number.parseFloat(String(candidate.value))
        return Math.abs(candidateHeight - height) < Math.abs(currentHeight - height) ? candidate : current
      })
      setActiveSnapPoint(nearest.id)
    },
    [snapPoints],
  )

  useImperativeHandle(
    ref,
    () => ({
      sheet: { snapTo },
      scrollElement,
    }),
    [scrollElement, snapTo],
  )

  const toggleFullscreen = () => setActiveSnapPoint(isFullscreen ? 'medium' : 'max')

  return (
    <Sheet.Root
      open
      modal={false}
      dismissible={false}
      snapPoints={snapPoints}
      activeSnapPoint={activeSnapPoint}
      onSnapPointChange={setActiveSnapPoint}>
      <Sheet.Portal>
        <StyledViewport>
          <StyledSheetContent aria-label={title ? undefined : t($ => $.common.handle)}>
            <SiblingLayer onPointerDown={event => event.stopPropagation()}>{sibling}</SiblingLayer>
            <Sheet.Handle asChild>
              <HeaderButton
                dir={contentDirection}
                onClick={toggleFullscreen}
                aria-label={t($ => $.common.handle)}
                aria-expanded={isFullscreen}>
                <HandleIcon sx={{ alignSelf: 'center', transform: 'scaleX(1.5)' }} />
                {!!title && (
                  <Sheet.Title asChild>
                    <Typography component='h1' variant='h5' sx={{ alignSelf: 'start' }}>
                      {title}
                    </Typography>
                  </Sheet.Title>
                )}
              </HeaderButton>
            </Sheet.Handle>
            <ScrollRegion ref={setScrollElement}>
              <StyledLayout dir={contentDirection}>{children}</StyledLayout>
            </ScrollRegion>
          </StyledSheetContent>
        </StyledViewport>
      </Sheet.Portal>
    </Sheet.Root>
  )
}

export default BottomActionSheet
