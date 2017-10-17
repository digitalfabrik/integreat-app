import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import normalizeUrl from 'normalize-url'
import { isEmpty } from 'lodash/lang'

import Page from './Page'

import Hierarchy from 'routes/LocationPage/Hierarchy'
import TitledContentList from './TitledContentList'
import LocationHome from './LocationHome'

class Content extends React.Component {
  static propTypes = {
    hierarchy: PropTypes.instanceOf(Hierarchy),
    url: PropTypes.string.isRequired
  }

  renderPages () {
    const hierarchy = this.props.hierarchy
    const page = hierarchy.top()

    if (isEmpty(page.children)) {
      return <Page page={ page }/>
    }

    let url = normalizeUrl(this.props.url, {removeTrailingSlash: true})
    let base = url + hierarchy.path()

    let pages = page.children.map((page) => ({ page, url: `${base}/${page.id}` }))

    return hierarchy.root()
      ? <LocationHome parentPage={ page } categories={ pages } />
      : <TitledContentList parentPage={ page } pages={ pages } />
  }

  render () {
    return <div>
      {this.renderPages()}
    </div>
  }
}

export default translate('errors')(Content)
