import React, { ReactElement } from 'react'
import SVG from 'react-inlinesvg'

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
  <SVG src={src} width={width} height={height} color='inherit' className={className} />
)

export default Svg
