import React, { ReactElement } from 'react'

export default ({ src, title, ...props }: { src: string; title: string }): ReactElement => (
  <svg id={src} role='img' {...props}>
    <title>{title}</title>
  </svg>
)
