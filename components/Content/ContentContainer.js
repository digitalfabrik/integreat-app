import React from 'react'
import PropTypes from 'prop-types'

import { isEmpty } from 'lodash/lang'

import Spinner from 'react-spinkit'

import style from './index.pcss'

import Heading from './Heading'
import TopLevelPage from './Overview'
import ContentPage from './Content'

class ContentContainer extends React.Component {
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
    } else if (this.props.pages.length === 1) {
      return <ContentPage page={this.props.pages[0]}/>
    } else {
      throw new Error('The pages ' + this.props.pages + ' is not renderable!')
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

export default ContentContainer
