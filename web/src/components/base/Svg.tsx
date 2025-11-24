import React, { ReactElement, useMemo } from 'react'
import { Box } from '@mui/material'
import { useSvgCache } from '../../hooks/useSvgCache'

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
}: CustomIconProps): ReactElement => {
  const svgContent = useSvgCache(src)
  
  // Use useMemo to prevent unnecessary re-renders
  const svgWithStyles = useMemo(() => {
    if (!svgContent) return null
    
    // Add width and height to the SVG element if they don't exist
    let processedSvg = svgContent
    if (typeof width === 'number' && !svgContent.includes('width=')) {
      processedSvg = processedSvg.replace('<svg', <svg width="${width}")
    }
    if (typeof height === 'number' && !svgContent.includes('height=')) {
      processedSvg = processedSvg.replace('<svg', <svg height="${height}")
    }
    
    return processedSvg
  }, [svgContent, width, height])

  if (!svgWithStyles) {
    return <Box component='span' sx={{ width, height, display: 'inline-block' }} />
  }

  return (
    <Box
      component='span'
      className={className}
      sx={{
        display: 'inline-flex',
        '& svg': {
          width,
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          fill: 'currentColor',
        },
      }}
      dangerouslySetInnerHTML={{ __html: svgWithStyles }}
    />
  )
}

export default React.memo(Svg)
// bug is resolved
