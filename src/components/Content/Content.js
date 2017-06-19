import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import { translate } from 'react-i18next'

import { values } from 'lodash/object'

import Categories from './Categories'
import Page from './Page'
import ContentList from './ContentList'

import style from './Content.css'
import Hierarchy from 'location/hierarchy'
import Error from 'components/Error/Error'

class Content extends React.Component {
  static propTypes = {
    hierarchy: PropTypes.instanceOf(Hierarchy),
    url: PropTypes.string.isRequired
  }

  renderPages () {
    let hierarchy = this.props.hierarchy

    let page = hierarchy.top()

    if (hierarchy.error()) {
      return <Error error={hierarchy.error()}/>
    } else if (!page) {
      return <Spinner className={style.loading} name='line-scale-party'/>
    } else {
      let children = values(page.children).length

      if (children === 0) {
        return <Page page={page}/>
      } else if (children > 0) {
        return hierarchy.isRoot() ? <Categories url={this.props.url} page={page}/>
          : <ContentList url={this.props.url} page={page}/>
      }
    }

    throw new Error('The page ' + page + ' is not renderable!')
  }

  render () {
    return <div>
      {this.renderPages()}
    </div>
  }
}

export default translate('errors')(Content)
