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

  mapLanguageToPath = language => `/${this.props.location}/${language}/search`

  componentDidMount () {
    this.props.setLanguageChangeUrls(this.mapLanguageToPath, this.props.languages)
  }

  findCategories () {
    const filterText = this.state.filterText.toLowerCase()

    // find all categories whose titles include the filter text and sort them lexicographically
    const categoriesWithTitle = this.props.categories.toArray()
      .filter(category => category.title.toLowerCase().includes(filterText))
      .sort((category1, category2) => category1.title.localeCompare(category2.title))

    // find all categories whose contents but not titles include the filter text and sort them lexicographically
    const categoriesWithContent = this.props.categories.toArray()
      .filter(category => !category.title.toLowerCase().includes(filterText))
      .filter(category => category.content.toLowerCase().includes(filterText))
      .sort((category1, category2) => category1.title.localeCompare(category2.title))

    // return all categories from above and remove the root category
    return categoriesWithTitle
      .filter(category => category.id !== 0)
      .concat(categoriesWithContent)
      .map(category => ({model: category, children: []}))
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
  setLanguageChangeUrls: (mapLanguageToPath, languages) =>
    dispatch(setLanguageChangeUrls(mapLanguageToPath, languages))
})

export default compose(
  withFetcher('categories'),
  withFetcher('languages'),
  connect(mapStateToProps, mapDispatchToProps)
)(SearchPage)
