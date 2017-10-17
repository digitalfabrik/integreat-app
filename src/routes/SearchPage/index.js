import React from 'react'
import PropTypes from 'prop-types'

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
    return `/${this.props.location}/${this.props.language}`
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
   * @param pages The result, can already contain some pages
   * @param baseUrl The base url
   * @param page The page
   */
  findPages (pages, baseUrl, page) {
    const url = baseUrl + '/' + page.id
    if (this.acceptPage(page)) {
      pages.push({ url, page })
    }
    page.children.forEach(page => this.findPages(pages, url, page))
  }

  render () {
    const url = normalizeUrl(this.getParentPath(), {removeTrailingSlash: true})
    const pages = []
    this.props.pages.children.forEach(page => this.findPages(pages, url, page))
    return <ContentList pages={pages}/>
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
        <PageFetcher>
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
