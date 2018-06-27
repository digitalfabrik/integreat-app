// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import SearchInput from 'modules/common/components/SearchInput'

import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import CategoryList from '../../categories/components/CategoryList'
import { translate } from 'react-i18next'
import CityModel from '../../../modules/endpoint/models/CityModel'
import type { I18nTranslateType, StateType } from '../../../flowTypes'
import Helmet from '../../../modules/common/containers/Helmet'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'

type PropsType = {
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  city: string,
  t: I18nTranslateType
}

type LocalStateTypeType = {
  filterText: string
}

export class SearchPage extends React.Component<PropsType, LocalStateTypeType> {
  stateType = {
    filterText: ''
  }

  findCategories (): Array<{|model: CategoryModel, subCategories: Array<CategoryModel>|}> {
    const categories = this.props.categories
    const filterText = this.stateType.filterText.toLowerCase()

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
    const {t, cities, city} = this.props

    const cityName = CityModel.findCityName(cities, city)

    return (
      <div>
        <Helmet title={`${t('pageTitle')} - ${cityName}`} />
        <SearchInput filterText={this.stateType.filterText}
                     placeholderText={t('searchCategory')}
                     onFilterTextChange={this.onFilterTextChange}
                     spaceSearch />
        <CategoryList categories={categories} query={this.stateType.filterText} />
      </div>
    )
  }
}

const mapStateTypeToProps = (stateType: StateType) => ({
  categories: stateType.categories.data,
  cities: stateType.cities.data,
  city: stateType.location.payload.city
})

export default compose(
  connect(mapStateTypeToProps),
  translate('search')
)(SearchPage)
