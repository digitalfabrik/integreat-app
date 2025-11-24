import React, { ReactElement } from 'react'
import { ReactSVG } from 'react-svg'

const DEFAULT_ICON_SIZE = 24

type CustomIconProps = {
  src: string
  width?: number | string
  height?: number | string
  className?: string
}

const Svg = ({
  src,
  width = DEFAULT_ICON_SIZE,
  height = DEFAULT_ICON_SIZE,
  className,
}: CustomIconProps): ReactElement => (
  <ReactSVG
    src={src}
    beforeInjection={svg => {
      svg.setAttribute('width', String(width))
      svg.setAttribute('height', String(height))
      svg.setAttribute('style', 'color: inherit')
      if (className) {
        svg.classList.add(className)
      }
    }}
    wrapper='span'
  />
)

export default Svg
