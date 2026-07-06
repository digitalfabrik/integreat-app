import React, { memo, ReactElement } from 'react'
import { ReactSVG } from 'react-svg'

const DEFAULT_ICON_SIZE = 24

type CustomIconProps = {
  src: string
  width?: number | string
  height?: number | string
  className?: string
  ariaLabel?: string
  overrideFillColors?: string
}

const Svg = ({
  src,
  width = DEFAULT_ICON_SIZE,
  height = DEFAULT_ICON_SIZE,
  className,
  ariaLabel,
  overrideFillColors,
}: CustomIconProps): ReactElement => (
  <ReactSVG
    src={src}
    className={className}
    beforeInjection={svg => {
      svg.setAttribute('width', String(width))
      svg.setAttribute('height', String(height))
      if (overrideFillColors) {
        svg.querySelectorAll('[fill]').forEach(element => element.setAttribute('fill', 'currentColor'))
        svg.setAttribute('style', `color: ${overrideFillColors}`)
      } else {
        svg.setAttribute('style', 'color: inherit')
      }
    }}
    wrapper='span'
    {...(ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : {})}
  />
)

export default memo(Svg)
