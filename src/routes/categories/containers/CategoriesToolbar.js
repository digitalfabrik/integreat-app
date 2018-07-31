// @flow

import React from 'react'
import { translate } from 'react-i18next'

import Toolbar from '../../../modules/layout/components/Toolbar'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import ToolbarItem from '../../../modules/layout/components/ToolbarItem'
import { apiUrl } from '../../../modules/endpoint/constants'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import type { TFunction } from 'react-i18next'
import FeedbackModal from '../../feedback/components/FeedbackModal'
import CityModel from '../../../modules/endpoint/models/CityModel'
import { POSITIVE_RATING } from '../../../modules/endpoint/FeedbackEndpoint'
import styled from 'styled-components'
import FeedbackLink from '../../feedback/components/FeedbackLink'
import type { LocationState } from 'redux-first-router'

const FeedbackToolbarItem = styled(FeedbackLink)`
  display: inline-block;
  margin: 0 10px;
  padding: 8px;
`

type PropsType = {
  cities: Array<CityModel>,
  categories: CategoriesMapModel,
  location: LocationState,
  t: TFunction
}

export class CategoriesToolbar extends React.PureComponent<PropsType> {
  getPdfUrl (category: CategoryModel): string {
    const {city, language} = this.props.location.payload

    if (category.id === 0) {
      return `${apiUrl}/${city}/${language}/wp-json/ig-mpdf/v1/pdf`
    } else {
      return `${apiUrl}/${city}/${language}/wp-json/ig-mpdf/v1/pdf?url=${category.path}`
    }
  }

  render () {
    const {t, cities, location} = this.props
    const feedbackType = location.query && location.query.feedback
    const category = this.props.categories.findCategoryByPath(location.pathname)
    if (!category) {
      return null
    }
    return <Toolbar>
      <ToolbarItem name='file-pdf-o' text={t('createPdf')} href={this.getPdfUrl(category)} />
      <FeedbackToolbarItem isPositiveRatingLink location={location} />
      <FeedbackToolbarItem isPositiveRatingLink={false} location={location} />
      <FeedbackModal
        id={category.id}
        title={category.title}
        cities={cities}
        isPositiveRatingSelected={feedbackType === POSITIVE_RATING}
        location={location}
        isOpen={!!feedbackType} />
      {/* todo: Add these functionalities:
              <ToolbarItem name='bookmark-o' text='Merken'href={this.getPdfFetchPath()} />
              <ToolbarItem name='share' text='Teilen' href={this.getPdfFetchPath()} />
              <ToolbarItem name='audio-description' text='Sprachausgabe' href={this.getPdfFetchPath()} /> */}
    </Toolbar>
  }
}

export default translate('categories')(CategoriesToolbar)
