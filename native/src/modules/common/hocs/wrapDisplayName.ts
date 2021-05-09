import * as React from 'react'

const getDisplayName = Component => Component.displayName || Component.name || typeof Component

const wrapDisplayName = (Component: React.AbstractComponent<any, any>, hocName: string) => {
  return `${hocName}(${getDisplayName(Component)})`
}

export default wrapDisplayName
