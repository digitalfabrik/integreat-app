import { ComponentType } from 'react'

const getDisplayName = <Props>(Component: ComponentType<Props>) =>
  Component.displayName || Component.name || typeof Component

const wrapDisplayName = <Props>(Component: ComponentType<Props>, hocName: string): string =>
  `${hocName}(${getDisplayName(Component)})`

export default wrapDisplayName
