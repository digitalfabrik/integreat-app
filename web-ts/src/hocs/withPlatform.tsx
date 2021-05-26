import * as React from 'react'
import Platform from '../contexts/Platform'
import PlatformContext from '../contexts/PlatformContext'
import wrapDisplayName from '../services/wrapDisplayName'

type PropsType = {
  platform: Platform
}

const withPlatform = <P extends PropsType>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<Omit<P, keyof PropsType>> => {
  return class extends React.Component<Omit<P, keyof PropsType>> {
    static displayName = wrapDisplayName(WrappedComponent, 'withPlatform')

    render() {
      return (
        <PlatformContext.Consumer>
          {platform => <WrappedComponent {...(this.props as P)} platform={platform} />}
        </PlatformContext.Consumer>
      )
    }
  }
}

export default withPlatform
