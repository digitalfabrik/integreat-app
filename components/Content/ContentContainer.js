import React from 'react'
import PropTypes from 'prop-types'

import { isEmpty } from 'lodash/lang'

import Spinner from 'react-spinkit'

import style from './ContentContainer.pcss'

import Heading from './Heading'
import TopLevelPage from './Root'
import ContentPage from './Content'
import { size } from 'lodash/collection'
import { PageModel } from '../../src/endpoints'

class ContentContainer extends React.Component {
  static propTypes = {
    pages: PropTypes.objectOf(PropTypes.instanceOf(PageModel)).isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.arrayOf(PropTypes.string)
  }

  renderPages () {
    let pages = size(this.props.pages)
    if (isEmpty(this.props.pages)) {
      return <Spinner className={style.loading} name='line-scale-party'/>
    } else if (pages > 0 && isEmpty(this.props.path)) {
      return <TopLevelPage pages={this.props.pages}/>
    } else if (pages === 1) {
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
