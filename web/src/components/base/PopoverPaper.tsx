import shouldForwardProp from '@emotion/is-prop-valid'
import Paper from '@mui/material/Paper'
import { CSSObject, keyframes, styled } from '@mui/material/styles'
import { Position } from '@reactour/tour'

const BORDER_RADIUS = 16
const ARROW_SIZE = 12
const ARROW_OFFSET = 24
const APPEAR_DURATION = 200

const ARROW_UP = 'polygon(0 100%, 50% 0, 100% 100%)'
const ARROW_DOWN = 'polygon(0 0, 50% 100%, 100% 0)'
const ARROW_LEFT = 'polygon(100% 0, 0 50%, 100% 100%)'
const ARROW_RIGHT = 'polygon(0 0, 100% 50%, 0 100%)'

const appear = keyframes({
  from: { opacity: 0, transform: 'scale(0.5)' },
  to: { opacity: 1, transform: 'scale(1)' },
})

export type ArrowAlignment = 'left' | 'right'

export type PopoverOffset = { horizontal?: number; vertical?: number }

const inlineInset = (side: ArrowAlignment, inset: number, rtl: boolean): CSSObject =>
  (side === 'left') !== rtl ? { insetInlineStart: inset } : { insetInlineEnd: inset }

// The position tells where the popover sits relative to the highlighted element, therefore the arrow points the other way
export const arrowStyle = (
  position: Position | undefined,
  alignment: ArrowAlignment,
  rtl: boolean,
  centerArrowVertically = false,
): CSSObject => {
  const verticalAlignment: CSSObject = centerArrowVertically
    ? { insetBlockStart: '50%', transform: 'translateY(-50%)' }
    : { insetBlockStart: ARROW_OFFSET }

  switch (position) {
    case 'top':
      return { insetBlockEnd: -ARROW_SIZE, ...inlineInset(alignment, ARROW_OFFSET, rtl), clipPath: ARROW_DOWN }
    case 'right':
      return { ...verticalAlignment, ...inlineInset('left', -ARROW_SIZE, rtl), clipPath: ARROW_LEFT }
    case 'left':
      return { ...verticalAlignment, ...inlineInset('right', -ARROW_SIZE, rtl), clipPath: ARROW_RIGHT }
    default:
      return { insetBlockStart: -ARROW_SIZE, ...inlineInset(alignment, ARROW_OFFSET, rtl), clipPath: ARROW_UP }
  }
}

type PopoverPaperProps = {
  arrowPosition: Position | undefined
  arrowAlignment: ArrowAlignment
  offset?: PopoverOffset
  centerArrowVertically?: boolean
}

const PopoverPaper = styled(Paper, {
  shouldForwardProp: prop =>
    shouldForwardProp(prop.toString()) && prop !== 'offset' && prop !== 'centerArrowVertically',
})<PopoverPaperProps>(({ theme, arrowPosition, arrowAlignment, offset, centerArrowVertically }) => ({
  borderRadius: BORDER_RADIUS,
  position: 'relative',
  insetInlineStart: offset?.horizontal,
  insetBlockStart: offset?.vertical,
  animation: `${appear} ${APPEAR_DURATION}ms ease-out`,

  '&::before': {
    content: '""',
    position: 'absolute',
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    background: 'inherit',
    ...arrowStyle(arrowPosition, arrowAlignment, theme.contentDirection === 'rtl', centerArrowVertically),
  },
}))

export default PopoverPaper
