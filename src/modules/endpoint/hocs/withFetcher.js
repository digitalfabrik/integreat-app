import React from 'react'
import Failure from '../../common/components/Failure'
import Spinner from 'react-spinkit'
import style from './withFetcher.css'

const withFetcher = (name, urlMapper, mapper, params, FailureComponent = Failure) => WrappedComponent =>
  class Fetcher extends React.Component {
    constructor (props) {
      super(props)
      this.state = {isLoading: true, data: null, error: null}
    }

    componentDidMount () {
      fetch(urlMapper(params))
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('Something went wrong ...')
          }
        })
        .then(json => mapper(json, params))
        .then(data => this.setState({isLoading: false, data: data}))
        .catch(error => this.setState({isLoading: false, error: error}))
    }

    render () {
      if (this.state.isLoading) {
        return <Spinner className={style.loading} name='line-scale-party' />
      }

      if (this.state.error) {
        return <FailureComponent />
      }
      const props = {...this.props, [name]: this.state.data}
      return <WrappedComponent {...props} />
    }
  }

export default withFetcher
