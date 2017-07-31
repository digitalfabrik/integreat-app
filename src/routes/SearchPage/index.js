import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { forEach } from 'lodash/collection'
import normalizeUrl from 'normalize-url'

import Payload from 'endpoints/Payload'

import ContentList from 'components/Content/ContentList'
import Search from 'components/Search/Search'
import PageLayout from 'components/PageLayout'

import style from './style.css'

class SearchPage extends React.Component {
  static propTypes = {
    pagePayload: PropTypes.instanceOf(Payload).isRequired
  }

  constructor () {
    super()

    this.state = {
      filterText: ''
    }
  }

  getParentPath () {
    return '/location/' + this.getLocation()
  }

  getLocation () {
    return this.props.match.params.location
  }

  acceptPage (page) {
    let title = page.title.toLowerCase()
    let content = page.content
    let filterText = this.state.filterText.toLowerCase()
    // todo:  comparing the content like this is quite in-efficient and can cause lags
    // todo:  1) Do this work in an other thread 2) create an index
    return title.includes(filterText) || content.toLowerCase().includes(filterText)
  }

  /**
   * @param url The base url
   * @param page The page
   * @param pages The result, can already contain some pages
   * @returns {{url: PageModel}, {}} All sub-pages of page in one map from url -> page
   */
  findPages (url, page, pages = {}) {
    if (!page) {
      return {}
    }

    forEach(page.children, page => {
      let nextUrl = url + '/' + page.id
      if (this.acceptPage(page)) {
        pages[nextUrl] = page
      }
      this.findPages(nextUrl, page, pages)
    })
    return pages
  }

  render () {
    let url = normalizeUrl(this.getParentPath(), {removeTrailingSlash: true})
    let page = this.props.pagePayload.data

    return (
      <PageLayout location={this.getLocation()}>
        <Search className={style.searchSpacing} filterText={this.state.filterText}
                onFilterTextChange={(filterText) => this.setState({filterText: (filterText)})}/>
        <ContentList pages={this.findPages(url, page)}/>
      </PageLayout>
    )
  }
}

/**
 * @param state The current app state
 * @return {{locations: {}}}  The endpoint values from the state mapped to props
 */
function mapStateToProps (state) {
  return ({
    pagePayload: state.pages
  })
}

export default connect(mapStateToProps)(SearchPage)
