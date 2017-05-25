import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from '../../components/Layout'

import fetchEndpoint from '../endpoint'
import { LANGUAGE_ENDPOINT } from '../endpoints'

import s from './styles.css'

class LocationPage extends React.Component {
  static propTypes = {
    languages: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.dispatch(fetchEndpoint(LANGUAGE_ENDPOINT, url => url.replace('{location}', 'augsburg').replace('{language}', 'en')))
  }

  render () {
    return (
      <Layout className={s.content}>
        {JSON.stringify(this.props.languages)}
      </Layout>
    )
  }
}
export default connect(state => ({languages: state.languages.data}))(LocationPage)
