import { ComponentType } from 'react'

const getDisplayName = Component => Component.displayName || Component.name || typeof Component

const wrapDisplayName = (Component: ComponentType, hocName: string) => {
  return `${hocName}(${getDisplayName(Component)})`
}

export default wrapDisplayName
