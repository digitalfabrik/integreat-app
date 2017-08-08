import React from 'react'
import PropTypes from 'prop-types'

import { forEach } from 'lodash/collection'
import normalizeUrl from 'normalize-url'

import ContentList from 'components/Content/ContentList'
import Search from 'components/Search/Search'
import HeaderLayout from 'components/HeaderLayout'
import PageFetcher from 'components/Fetcher/PageFetcher'

import style from './style.css'

class ContentListAdapter extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    filterText: PropTypes.string.isRequired
  }

  getParentPath () {
    return '/location/' + this.props.location
  }

  acceptPage (page) {
    let title = page.title.toLowerCase()
    let content = page.content
    let filterText = this.props.filterText.toLowerCase()
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

    return <ContentList pages={this.findPages(url, this.props.page)}/>
  }
}

class SearchPage extends React.Component {
  constructor () {
    super()
    this.state = {filterText: ''}
  }

  getLocation () {
    return this.props.match.params.location
  }

  render () {
    return (
      <HeaderLayout location={this.getLocation()}>
        <PageFetcher location={this.getLocation()}>
          <Search className={style.searchSpacing}
                  filterText={this.state.filterText}
                  onFilterTextChange={(filterText) => this.setState({filterText: (filterText)})}
          />
          <ContentListAdapter location={this.getLocation()} filterText={this.state.filterText}/>
        </PageFetcher>
      </HeaderLayout>
    )
  }
}

export default SearchPage
