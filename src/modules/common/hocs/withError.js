// @flow

import * as React from 'react'
import Failure from '../components/Failure'

type PropsType = {
  error?: string
}

function withError<Props: PropsType> (
  Component: React.ComponentType<Props>): React.ComponentType<$Diff<Props, { error: string }>> {
  class ErrorComponent extends React.PureComponent<Props> {
    render () {
      const {error, ...props} = this.props

      if (error) {
        return <Failure error={new Error(error)} />
      }

      return <Component {...props} />
    }
  }
  // $FlowFixMe Please have a look at this
  return ErrorComponent
}

export default withError
