import React from 'react'
import s from './styles.css'

import history from '../main'
import Layout from '../../components/Layout'

class ErrorPage extends React.Component {
  componentDidMount () {

  }

  goBack = (event) => {
    event.preventDefault()
    history.goBack()
  }

  render () {
    return (
      <Layout languageTo='/' className={s.content}>
        <a href="/" onClick={this.goBack}>Go back</a>
      </Layout>
    )
  }
}

export default ErrorPage
