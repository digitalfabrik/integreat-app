import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import compose from 'lodash/fp/compose'

import SearchInput from 'modules/common/components/SearchInput'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import setLanguageChangeUrls from 'modules/language/actions/setLanguageChangeUrls'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import CategoryList from '../../categories/components/CategoryList'

export class SearchPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    categories: PropTypes.instanceOf(CategoriesMapModel).isRequired,
    setLanguageChangeUrls: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {filterText: ''}
  }

  mapLanguageToUrl = language => `/${this.props.location}/${language}/search`

  componentDidMount () {
    this.props.setLanguageChangeUrls(this.mapLanguageToUrl, this.props.languages)
  }

  acceptCategory (category) {
    const filterText = this.state.filterText.toLowerCase()
    const title = category.title.toLowerCase()
    const content = category.content.toLowerCase()
    return title.includes(filterText) || content.includes(filterText)
  }

  findCategories () {
    const filterText = this.state.filterText.toLowerCase()

    return this.props.categories.toArray()
      .filter(category => this.acceptCategory(category))
      // sort results so that categories including the filter text in the title on top
      .sort((category1, category2) => {
        if (category1.title.toLowerCase().includes(filterText) && !category2.title.toLowerCase().includes(filterText)) {
          // category1 includes the filterText in the title while category2 doesn't, so category1 should be first
          return -1
        } else if (category1.title.toLowerCase().includes(filterText) ||
          !category2.title.toLowerCase().includes(filterText)) {
          // the filterText is either included in the title of both categories or the content of both categories
          if (category1.title < category2.title) {
            // the title of category1 is lexicographically smaller than the title of category2 so it should be first
            return -1
          } else {
            // the title of category1 is lexicographically bigger than the title of category2 so it should be last
            return 1
          }
        } else {
          // category2 includes the filterText in the title while category1 doesn't, so category1 should be first
          return 1
        }
      })
      .map(model => ({model, children: []}))
  }

  onFilterTextChange = filterText => this.setState({filterText: filterText})

  render () {
    const categories = this.findCategories()

    return (
      <div>
        <SearchInput filterText={this.state.filterText}
                     onFilterTextChange={this.onFilterTextChange}
                     spaceSearch />
        <CategoryList categories={categories} query={this.state.filterText} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  location: state.router.params.location
})

const mapDispatchToProps = dispatch => ({
  setLanguageChangeUrls: (mapLanguageToUrl, languages) =>
    dispatch(setLanguageChangeUrls(mapLanguageToUrl, languages))
})

export default compose(
  withFetcher('categories'),
  withFetcher('languages'),
  connect(mapStateToProps, mapDispatchToProps)
)(SearchPage)
