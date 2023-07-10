declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'

  const content: React.JSXElementConstructor<SvgProps>
  export default content
}
declare module '*.jpg' {
  const content: number
  export default content
}

declare module '*.png' {
  const content: number
  export default content
}

declare module '*.json' {
  const content: string
  export default content
}
