import React, { memo, ReactElement } from 'react'
import { ReactSVG } from 'react-svg'

const DEFAULT_ICON_SIZE = 24

type CustomIconProps = {
  src: string
  width?: number | string
  height?: number | string
  className?: string
  ariaLabel?: string
  inheritColor?: boolean
}

const Svg = ({
  src,
  width = DEFAULT_ICON_SIZE,
  height = DEFAULT_ICON_SIZE,
  className,
  ariaLabel,
  inheritColor = false,
}: CustomIconProps): ReactElement => (
  <ReactSVG
    src={src}
    className={className}
    beforeInjection={svg => {
      svg.setAttribute('width', String(width))
      svg.setAttribute('height', String(height))
      // The svg is only injected once, so the color must not be set here but inherited from the wrapper via css,
      // otherwise it does not update when switching themes.
      if (inheritColor) {
        svg.querySelectorAll('[fill]').forEach(element => element.setAttribute('fill', 'currentColor'))
      }
      svg.setAttribute('style', 'color: inherit')
    }}
    wrapper='span'
    {...(ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : {})}
  />
)

export default memo(Svg)
