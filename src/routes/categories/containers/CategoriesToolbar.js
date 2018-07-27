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
import FeedbackButton from '../../feedback/components/FeedbackLink'

const FeedbackToolbarItem = styled(FeedbackButton)`
  display: inline-block;
  margin: 0 10px;
  padding: 8px;
`

type PropsType = {
  cities: Array<CityModel>,
  city: string,
  language: string,
  categories: CategoriesMapModel,
  pathname: string,
  route: string,
  feedbackType: ?string,
  t: TFunction
}

export class CategoriesToolbar extends React.PureComponent<PropsType> {
  getPdfUrl (category: CategoryModel): string {
    if (category.id === 0) {
      return `${apiUrl}/${this.props.city}/${this.props.language}/wp-json/ig-mpdf/v1/pdf`
    } else {
      return `${apiUrl}/${this.props.city}/${this.props.language}/wp-json/ig-mpdf/v1/pdf?url=${category.path}`
    }
  }

  render () {
    const {t, city, language, cities, route, pathname, feedbackType} = this.props
    const category = this.props.categories.findCategoryByPath(pathname)
    if (!category) {
      return null
    }
    return <Toolbar>
      <ToolbarItem name='file-pdf-o' text={t('createPdf')} href={this.getPdfUrl(category)} />
      <FeedbackToolbarItem isPositiveRatingLink pathname={pathname} />
      <FeedbackToolbarItem
        isPositiveRatingLink={false}
        pathname={pathname} />
      <FeedbackModal
        id={category.id}
        title={category.title}
        city={city}
        cities={cities}
        route={route}
        language={language}
        isPositiveRatingSelected={feedbackType === POSITIVE_RATING}
        pathname={pathname}
        isOpen={feedbackType !== undefined} />
      {/* todo: Add these functionalities:
              <ToolbarItem name='bookmark-o' text='Merken'href={this.getPdfFetchPath()} />
              <ToolbarItem name='share' text='Teilen' href={this.getPdfFetchPath()} />
              <ToolbarItem name='audio-description' text='Sprachausgabe' href={this.getPdfFetchPath()} /> */}
    </Toolbar>
  }
}

export default translate('categories')(CategoriesToolbar)
