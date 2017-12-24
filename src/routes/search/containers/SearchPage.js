import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import compose from 'lodash/fp/compose'

import ContentList from 'routes/categories/components/ContentList'
import SearchInput from 'modules/common/components/SearchInput'

import style from './SearchPage.css'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import CATEGORIES_ENDPOINT from 'modules/endpoint/endpoints/categories'
import LANGUAGES_ENDPOINT from 'modules/endpoint/endpoints/languages'
import CategoryModel from 'modules/endpoint/models/CategoryModel'
import { setLanguageChangeUrls } from 'modules/language/actions/setLanguageChangeUrls'
import LanguageModel from 'modules/endpoint/models/LanguageModel'

class SearchPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    categories: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired
  }

  mapLanguageToUrl = (language) => `/${this.props.location}/${language}/search`

  componentDidMount () {
    this.props.dispatch(setLanguageChangeUrls(this.testmapLanguageToUrl, this.props.languages))
  }

  constructor () {
    super()
    this.state = {filterText: ''}
  }

  getBaseUrl () {
    return `/${this.props.location}/${this.props.language}`
  }

  acceptCategory (category) {
    let title = category.title.toLowerCase()
    let content = category.content
    let filterText = this.state.filterText.toLowerCase()
    // todo:  comparing the content like this is quite in-efficient and can cause lags
    // todo:  1) Do this work in an other thread 2) create an index
    return title.includes(filterText) || content.toLowerCase().includes(filterText)
  }

  render () {
    const categories = this.props.categories.filter(category => this.acceptCategory(category))

    return (
      <div>
        <SearchInput className={style.searchSpacing}
                     filterText={this.state.filterText}
                     onFilterTextChange={(filterText) => this.setState({filterText: filterText})} />
        <ContentList categories={categories} baseUrl={this.getBaseUrl()} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location
})

export default compose(
  withFetcher(CATEGORIES_ENDPOINT),
  withFetcher(LANGUAGES_ENDPOINT),
  connect(mapStateToProps)
)(SearchPage)
