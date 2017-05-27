import React from 'react'
import PropTypes from 'prop-types'

import { isEmpty } from 'lodash/lang'

import Spinner from 'react-spinkit'

import style from './Page.pcss'

import Heading from './Heading'
import TopLevelPage from './TopLevelPage'

class Page extends React.Component {
  static propTypes = {
    pages: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
  }

  renderPages () {
    if (isEmpty(this.props.pages)) {
      return <Spinner className={style.loading} name='line-scale-party'/>
    } else {
      return <TopLevelPage pages={this.props.pages}/>
    }
  }

  render () {
    return <div>
      <Heading title={this.props.title}/>
      <div className="row">
        {this.renderPages()}
      </div>
    </div>
  }
}

export default Page
