import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import normalizeUrl from 'normalize-url'
import compose from 'lodash/fp/compose'

import ContentList from 'components/Content/ContentList'
import Search from 'components/Search/Search'
import RichLayout from 'components/RichLayout'

import style from './style.css'

import withFetcher from 'endpoints/withFetcher'
import PAGE_ENDPOINT from 'endpoints/page'
import PageModel from '../../endpoints/models/PageModel'

class ContentWrapper extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    filterText: PropTypes.string.isRequired,
    pages: PropTypes.instanceOf(PageModel).isRequired
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
      pages.push({url, page})
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

const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  path: state.router.params['_'] // _ contains all the values from *
})

const FetchingContentWrapper = compose(
  connect(mapStateToProps),
  withFetcher(PAGE_ENDPOINT)
)(ContentWrapper)

class SearchPage extends React.Component {
  constructor () {
    super()
    this.state = {filterText: ''}
  }

  render () {
    return (
      <RichLayout>
        <Search className={style.searchSpacing}
                filterText={this.state.filterText}
                onFilterTextChange={(filterText) => this.setState({filterText: (filterText)})}
        />
        <FetchingContentWrapper filterText={this.state.filterText}/>
      </RichLayout>
    )
  }
}

export default SearchPage
