import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../../components/Layout'
import { connect } from 'react-redux'

import { fetchDataIfNeeded } from '../actions'
import Location from '../../components/Location/Location'

import s from './styles.css'

class LandingPage extends React.Component {
  static propTypes = {
    locations: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.dispatch(fetchDataIfNeeded())
  }

  render () {
    return (
      <Layout className={s.content}>
        <Location locations={this.props.locations}/>
      </Layout>
    )
  }
}

function mapStateToProps (state) {
  return {
    locations: state.restData.data
  }
}

export default connect(mapStateToProps)(LandingPage)
