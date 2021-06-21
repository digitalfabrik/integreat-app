import * as React from 'react'

const getDisplayName = Component => Component.displayName || Component.name || typeof Component

const wrapDisplayName = <T>(Component: React.ComponentType<T>, hocName: string): string => {
  return `${hocName}(${getDisplayName(Component)})`
}

export default wrapDisplayName
