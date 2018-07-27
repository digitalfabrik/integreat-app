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
import FeedbackModal from '../../feedback/components/FeedbackModal'
import styled from 'styled-components'
import CleanLink from '../../../modules/common/components/CleanLink'
import Feedback from '../../feedback/components/Feedback'
import { POSITIVE_RATING } from '../../../modules/endpoint/FeedbackEndpoint'

const FeedbackButton = styled.div`
  padding: 30px 0;
  text-align: center;
`

const FeedbackLink = styled(CleanLink)`
  padding: 5px 20px;
  background-color: ${props => props.theme.colors.themeColor};
  color: ${props => props.theme.colors.backgroundAccentColor};
  border-radius: 0.25em;
`

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

type CategoryListItemType = {|model: CategoryModel, subCategories: Array<CategoryModel>|}

type PropsType = {
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  city: string,
  pathname: string,
  route: string,
  language: string,
  feedbackType: ?string,
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

  renderFeedback = (categories: Array<CategoryListItemType>) => {
    const {filterText} = this.state
    const {t, cities, city, language, route, pathname, feedbackType} = this.props

    if (categories.length !== 0) {
      return (
        <React.Fragment>
          {filterText && (
            <FeedbackButton>
              <FeedbackLink to={`${pathname}?feedback=down`}>{t('informationNotFound')}</FeedbackLink>
            </FeedbackButton>
          )}
          <FeedbackModal
            query={filterText}
            city={city}
            cities={cities}
            language={language}
            route={route}
            pathname={pathname}
            isPositiveRatingSelected={feedbackType === POSITIVE_RATING}
            isOpen={feedbackType !== undefined}
            commentMessageOverride={t('wantedInformation')} />
        </React.Fragment>
      )
    } else {
      return (
        <FeedbackContainer>
          <div>{t('nothingFound')}</div>
          <Feedback
            query={filterText}
            city={city}
            cities={cities}
            language={language}
            route={route}
            pathname={pathname}
            isPositiveRatingSelected={false}
            isOpen={feedbackType !== undefined}
            commentMessageOverride={t('wantedInformation')}
            hideHeader />
        </FeedbackContainer>
      )
    }
  }

  render () {
    const categories = this.findCategories()
    const {t, cities, city} = this.props

    const cityName = CityModel.findCityName(cities, city)

    return (
      <div>
        <Helmet title={`${t('pageTitle')} - ${cityName}`} />
        <SearchInput filterText={this.state.filterText}
                     placeholderText={t('searchCategory')}
                     onFilterTextChange={this.onFilterTextChange}
                     spaceSearch />
        <CategoryList categories={categories} query={this.state.filterText} />
        {this.renderFeedback(categories)}
      </div>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  categories: state.categories.data,
  cities: state.cities.data,
  city: state.location.payload.city,
  language: state.location.payload.language,
  route: state.location.type,
  pathname: state.location.pathname,
  feedbackType: state.location.query && state.location.query.feedback
})

export default compose(
  connect(mapStateToProps),
  translate('search')
)(SearchPage)
