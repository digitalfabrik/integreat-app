import React from 'react'
import Layout from 'modules/app/components/Layout'
import AutoHeader from './AutoHeader'
import Footer from './Footer'

class RichLayout extends React.Component {
  render () {
    return <Layout header={<AutoHeader />} footer={<Footer />}>{this.props.children}</Layout>
  }
}

export default RichLayout
