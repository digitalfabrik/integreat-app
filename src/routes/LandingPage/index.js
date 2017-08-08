import React from 'react'

import Layout from 'components/Layout'
import { LocationFetcher } from 'components/Fetcher'
import FilterableLocation from 'components/Location/FilterableLocation'

class LandingPage extends React.Component {
  render () {
    return (
      <Layout>
        <LocationFetcher>
          <FilterableLocation locationCallback={(location) => {}}/>
        </LocationFetcher>
      </Layout>
    )
  }
}

export default LandingPage
