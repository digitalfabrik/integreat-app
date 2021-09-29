import * as React from 'react'

const getDisplayName = <T>(Component: React.ComponentType<T>) =>
  Component.displayName || Component.name || typeof Component

const wrapDisplayName = <T>(Component: React.ComponentType<T>, hocName: string): string =>
  `${hocName}(${getDisplayName(Component)})`

export default wrapDisplayName
