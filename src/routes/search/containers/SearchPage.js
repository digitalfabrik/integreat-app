// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import SearchInput from 'modules/common/components/SearchInput'

import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import CategoryList from '../../categories/components/CategoryList'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'
import CityModel from '../../../modules/endpoint/models/CityModel'
import type { StateType } from '../../../modules/app/StateType'
import Helmet from '../../../modules/common/containers/Helmet'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import SearchFeedback from '../components/SearchFeedback'
import type { LocationState } from 'redux-first-router'

type CategoryListItemType = {|model: CategoryModel, subCategories: Array<CategoryModel>|}

type PropsType = {
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  location: LocationState,
  t: TFunction
}

type LocalStateType = {
  filterText: string
}

export class SearchPage extends React.Component<PropsType, LocalStateType> {
  state = {
    filterText: ''
  }

  findCategories (): Array<CategoryListItemType> {
    const categories = this.props.categories
    const filterText = this.state.filterText.toLowerCase()

    // find all categories whose titles include the filter text and sort them lexicographically
    const categoriesWithTitle = categories.toArray()
      .filter(category => category.title.toLowerCase().includes(filterText))
      .sort((category1, category2) => category1.title.localeCompare(category2.title))

    // find all categories whose contents but not titles include the filter text and sort them lexicographically
    const categoriesWithContent = categories.toArray()
      .filter(category => !category.title.toLowerCase().includes(filterText))
      .filter(category => category.content.toLowerCase().includes(filterText))
      .sort((category1, category2) => category1.title.localeCompare(category2.title))

    // return all categories from above and remove the root category
    return categoriesWithTitle
      .filter(category => category.id !== 0)
      .concat(categoriesWithContent)
      .map(category => ({model: category, subCategories: []}))
  }

  onFilterTextChange = (filterText: string) => this.setState({filterText: filterText})

  render () {
    const categories = this.findCategories()
    const {t, cities, location} = this.props
    const {filterText} = this.state
    const {city} = location.payload

    const cityName = CityModel.findCityName(cities, city)

    return (
      <div>
        <Helmet title={`${t('pageTitle')} - ${cityName}`} />
        <SearchInput filterText={this.state.filterText}
                     placeholderText={t('searchCategory')}
                     onFilterTextChange={this.onFilterTextChange}
                     spaceSearch />
        <CategoryList categories={categories} query={this.state.filterText} />
        <SearchFeedback
          cities={cities}
          location={location}
          resultsFound={categories.length !== 0}
          query={filterText} />
      </div>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  categories: state.categories.data,
  cities: state.cities.data,
  location: state.location
})

export default compose(
  connect(mapStateToProps),
  translate('search')
)(SearchPage)
