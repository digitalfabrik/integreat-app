import React from 'react'
import PropTypes from 'prop-types'

import { forEach } from 'lodash/collection'
import normalizeUrl from 'normalize-url'

import ContentList from 'components/Content/ContentList'
import Search from 'components/Search/Search'
import RichLayout from 'components/RichLayout'
import { PageFetcher } from 'endpoints'

import style from './style.css'
import { connect } from 'react-redux'

class ContentListAdapter extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    filterText: PropTypes.string.isRequired
  }

  getParentPath () {
    return `/${this.props.language}/${this.props.location}/location`
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

    return <ContentList pages={this.findPages(url, this.props.pages)}/>
  }
}

class SearchPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  constructor () {
    super()
    this.state = {filterText: ''}
  }

  render () {
    return (
      <RichLayout location={this.props.location}>
        <PageFetcher options={{}}>
          <Search className={style.searchSpacing}
                  filterText={this.state.filterText}
                  onFilterTextChange={(filterText) => this.setState({filterText: (filterText)})}
          />
          <ContentListAdapter location={this.props.location} language={this.props.language} filterText={this.state.filterText}/>
        </PageFetcher>
      </RichLayout>
    )
  }
}

function mapStateToProps (state) {
  return {
    location: state.router.params.location,
    language: state.router.params.language
  }
}

export default connect(mapStateToProps)(SearchPage)
