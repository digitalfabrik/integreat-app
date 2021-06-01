import { ComponentType } from 'react'

const getDisplayName = Component => Component.displayName || Component.name || typeof Component

const wrapDisplayName = <Props>(Component: ComponentType<Props>, hocName: string): string => {
  return `${hocName}(${getDisplayName(Component)})`
}

export default wrapDisplayName
