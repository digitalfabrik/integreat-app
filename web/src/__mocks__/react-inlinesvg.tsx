import React, { ReactElement } from 'react'

export default ({ src, alt, ...props }: { src: string; alt: string }): ReactElement => (
  <img id={src} alt={alt} {...props} />
)
