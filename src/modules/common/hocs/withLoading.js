// @flow

import * as React from 'react'
import { ActivityIndicator } from 'react-native'

export type LoadingType = {|
  loading: boolean
|}

type PropsType<T> = LoadingType | T

function withLoading<Props: PropsType<*>> (
  Component: React.ComponentType<Props>): React.ComponentType<*> {
  class LoadingComponent extends React.PureComponent<Props> {
    render () {
      const {loading, ...props} = this.props

      if (loading) {
        return <ActivityIndicator size='large' color='#0000ff' />
      }

      return <Component {...props} />
    }
  }

  return LoadingComponent
}

export default withLoading
