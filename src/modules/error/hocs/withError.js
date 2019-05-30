// @flow

import * as React from 'react'
import Failure from '../components/Failure'

export type ErrorType = {|
  error: boolean
|}

type PropsType<T> = ErrorType | T

function withError<Props: PropsType<*>> (
  Component: React.ComponentType<Props>): React.ComponentType<*> {
  class ErrorComponent extends React.PureComponent<Props> {
    render () {
      const {error, ...props} = this.props

      if (error) {
        return <Failure />
      }

      return <Component {...props} />
    }
  }

  return ErrorComponent
}

export default withError
