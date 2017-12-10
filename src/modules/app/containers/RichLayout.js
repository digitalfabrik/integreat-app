import React from 'react'
import PropTypes from 'prop-types'
import Layout from 'modules/app/components/Layout'
import Header from './Header'
import Footer from './Footer'

import style from './RichLayout.css'

class RichLayout extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  render () {
    return (
      <div className={style.richLayout}>
        <div>
          <Header />
          <Layout className={this.props.className}>{this.props.children}</Layout>
        </div>
        <Footer/>
      </div>
    )
  }
}

export default RichLayout
