import React from 'react'
import PropTypes from 'prop-types'

import Spinner from 'react-spinkit'

import style from './Content.pcss'

import Heading from './Heading'
import RootList from './RootList'
import ContentElement from './ContentElement'
import { values } from 'lodash/object'
import { PageModel } from '../../src/endpoints/page'
import ContentList from './ContentList'

class Content extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    title: PropTypes.string.isRequired,
    root: PropTypes.bool,
    url: PropTypes.string
  }

  renderPages () {
    let page = this.props.page
    let children = values(page.children).length
    if (page.title === '') {
      return <Spinner className={style.loading} name='line-scale-party'/>
    } else if (children > 0 && this.props.root) {
      return <RootList url={this.props.url} page={page}/>
    } else if (children === 0) {
      return <ContentElement page={page}/>
    } else if (children > 0) {
      return <ContentList url={this.props.url} page={page}/>
    } else {
      throw new Error('The page ' + page + ' is not renderable!')
    }
  }

  render () {
    return <div>
      <Heading title={this.props.title}/>
      {this.renderPages()}
    </div>
  }
}

export default Content
