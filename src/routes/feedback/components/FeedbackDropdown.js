// @flow

import Dropdown from 'react-dropdown'
import { EVENTS_ROUTE } from '../../../modules/app/routes/events'
import {
  CATEGORIES_FEEDBACK_TYPE,
  EXTRA_FEEDBACK_TYPE,
  PAGE_FEEDBACK_TYPE,
  SEARCH_FEEDBACK_TYPE
} from '../../../modules/endpoint/FeedbackEndpoint'
import { DISCLAIMER_ROUTE } from '../../../modules/app/routes/disclaimer'
import { EXTRAS_ROUTE } from '../../../modules/app/routes/extras'
import { CATEGORIES_ROUTE } from '../../../modules/app/routes/categories'
import { SEARCH_ROUTE } from '../../../modules/app/routes/search'
import CityModel from '../../../modules/endpoint/models/CityModel'
import React from 'react'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'

export type FeedbackDropdownType = {
  value: string,
  feedbackType: string | null,
  label: string
}

type PropsType = {
  cities: Array<CityModel>,
  city: string,
  id?: number,
  title: string,
  alias?: string,
  query?: string,
  route: string,
  onFeedbackOptionChanged: (FeedbackDropdownType) => void,
  t: TFunction
}

type StateType = {
  feedbackOptions: Array<FeedbackDropdownType>,
  selectedFeedbackOption: FeedbackDropdownType
}

class FeedbackDropdown extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    const feedbackOptions = this.getFeedbackOptions()
    const selectedFeedbackOption = feedbackOptions[0]
    this.state = {feedbackOptions, selectedFeedbackOption: selectedFeedbackOption}
    props.onFeedbackOptionChanged(selectedFeedbackOption)
  }

  componentDidUpdate (prevProps: PropsType) {
    if (this.props !== prevProps) {
      this.updateState(prevProps)
    }
  }

  updateState = (): void => {
    const feedbackOptions = this.getFeedbackOptions()
    const selectedFeedbackOption = feedbackOptions[0]
    this.setState({feedbackOptions, selectedFeedbackOption: selectedFeedbackOption})
  }

  getFeedbackOptions = (): Array<FeedbackDropdownType> => {
    const {cities, city, t} = this.props
    const options = []
    const currentPageFeedbackLabel = this.getCurrentPageFeedbackLabel()
    if (currentPageFeedbackLabel) {
      options.push(this.getFeedbackOption(currentPageFeedbackLabel, this.getCurrentPageFeedbackType()))
    }
    if (city) {
      const cityTitle = CityModel.findCityName(cities, city)
      options.push(this.getFeedbackOption(`${t('contentOfCity')} ${cityTitle}`, CATEGORIES_FEEDBACK_TYPE))
    }

    options.push(this.getFeedbackOption(t('app'), CATEGORIES_FEEDBACK_TYPE))

    return options
  }

  getFeedbackOption = (label: string, feedbackType: string | null): FeedbackDropdownType =>
    ({value: label, feedbackType, label})

  getCurrentPageFeedbackLabel = (): ?string => {
    const {route, id, alias, title, query, t} = this.props

    if (route === CATEGORIES_ROUTE && id) {
      return `${t('contentOfPage')} '${title}'`
    } else if (route === EVENTS_ROUTE && id) {
      return `${t('news')} '${title}'`
    } else if (route === EXTRAS_ROUTE && alias) {
      return `${t('extra')} '${title}'`
    } else if (route === SEARCH_ROUTE && query) {
      return `${t('searchFor')} '${query}'`
    } else if (route === DISCLAIMER_ROUTE) {
      return `${t('disclaimer')}`
    } else {
      return null
    }
  }

  getCurrentPageFeedbackType = (): string | null => {
    const {route} = this.props
    if (route === SEARCH_ROUTE) {
      return SEARCH_FEEDBACK_TYPE
    } else if (route === EXTRAS_ROUTE) {
      return EXTRA_FEEDBACK_TYPE
    } else {
      return PAGE_FEEDBACK_TYPE
    }
  }

  onFeedbackOptionChanged = (dropdown: FeedbackDropdownType) => {
    const {onFeedbackOptionChanged} = this.props
    this.setState({selectedFeedbackOption: dropdown})
    onFeedbackOptionChanged(this.state.selectedFeedbackOption)
  }

  render () {
    const {selectedFeedbackOption, feedbackOptions} = this.state
    return (
      <Dropdown value={selectedFeedbackOption} options={feedbackOptions} onChange={this.onFeedbackOptionChanged} />
    )
  }
}

export default translate('feedback')(FeedbackDropdown)
