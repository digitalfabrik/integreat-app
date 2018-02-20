import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import compose from 'lodash/fp/compose'

import SearchInput from 'modules/common/components/SearchInput'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import { setLanguageChangeUrls } from 'modules/language/actions/setLanguageChangeUrls'
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

  mapLanguageToUrl = (language) => `/${this.props.location}/${language}/search`

  componentDidMount () {
    this.props.setLanguageChangeUrls(this.mapLanguageToUrl, this.props.languages)
  }

  acceptCategory (category) {
    const title = category.title.toLowerCase()
    const content = category.content
    const filterText = this.state.filterText.toLowerCase()
    return title.includes(filterText) || content.toLowerCase().includes(filterText)
  }

  findCategories () {
    return this.props.categories.toArray()
      .filter(category => this.acceptCategory(category))
      .map(model => ({model, children: []}))
  }

  render () {
    const categories = this.findCategories()

    return (
      <div>
        <SearchInput filterText={this.state.filterText}
                     onFilterTextChange={(filterText) => this.setState({filterText: filterText})}
                     spaceSearch />
        <CategoryList categories={categories} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.params.location
})

const mapDispatchToProps = (dispatch) => ({
  setLanguageChangeUrls: (mapLanguageToUrl, languages) =>
    dispatch(setLanguageChangeUrls(mapLanguageToUrl, languages))
})

export default compose(
  withFetcher('categories'),
  withFetcher('languages'),
  connect(mapStateToProps, mapDispatchToProps)
)(SearchPage)
