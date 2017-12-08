import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import normalizeUrl from 'normalize-url'
import { isEmpty } from 'lodash/lang'
import compose from 'lodash/fp/compose'

import EventModel from 'modules/endpoint/models/EventModel'
import Hierarchy from 'routes/content/Hierarchy'

import Page from '../components/Page'
import CategoryTiles from './CategoryTiles'
import TitledContentList from './TitledContentList'

class Content extends React.Component {
  static propTypes = {
    /**
     * from withFetcher HOC which provides data from EVENTS_ENDPOINT
     */
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)),
    hierarchy: PropTypes.instanceOf(Hierarchy),
    url: PropTypes.string.isRequired
  }

  render () {
    const hierarchy = this.props.hierarchy
    const page = hierarchy.top()

    if (isEmpty(page.children)) {
      return <Page page={page}/>
    }

    const url = normalizeUrl(this.props.url, {removeTrailingSlash: true})
    const base = url + hierarchy.path()

    const pages = page.children.map((page) => ({page, url: `${base}/${page.id}`}))

    if (hierarchy.root()) {
      return <CategoryTiles pages={pages} parentPage={page}/>
    } else {
      return <TitledContentList parentPage={page} pages={pages}/>
    }
  }
}

const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location
})

export default compose(
  connect(mapStateToProps)
)(Content)
