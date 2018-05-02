// @flow

import React from 'react'
import Spinner from 'react-spinkit'

import style from './LoadingSpinner.css'

class LoadingSpinner extends React.Component<{}> {
  render () {
    return <Spinner className={style.centered} name='line-scale-party' />
  }
}

export default LoadingSpinner
