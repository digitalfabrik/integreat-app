import React from 'react'
import PropTypes from 'prop-types'

import { isEmpty } from 'lodash/lang'

import Spinner from 'react-spinkit'

import style from './Page.pcss'

import Heading from './Heading'
import TopLevelPage from './TopLevelPage'
import ContentPage from './ContentPage'

class Page extends React.Component {
  static propTypes = {
    pages: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.array
  }

  renderPages () {
    if (isEmpty(this.props.pages)) {
      return <Spinner className={style.loading} name='line-scale-party'/>
    } else if (isEmpty(this.props.path)) {
      return <TopLevelPage pages={this.props.pages}/>
    } else {
      return <ContentPage page={this.props.pages[0]}/>
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
