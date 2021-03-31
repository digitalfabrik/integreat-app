// @flow

import React from 'react'
import { render } from '@testing-library/react'
import { FeedbackBoxContainer } from '../FeedbackBoxContainer'
import { CATEGORIES_ROUTE } from '../../../app/route-configs/CategoriesRouteConfig'
import {
  CATEGORIES_FEEDBACK_TYPE,
  EVENTS_FEEDBACK_TYPE,
  OFFER_FEEDBACK_TYPE,
  OfferModel,
  PAGE_FEEDBACK_TYPE,
  SEARCH_FEEDBACK_TYPE,
  CONTENT_FEEDBACK_CATEGORY,
  TECHNICAL_FEEDBACK_CATEGORY
} from 'api-client'
import FeedbackVariant from '../../FeedbackVariant'
import { OFFERS_ROUTE } from '../../../app/route-configs/OffersRouteConfig'
import { EVENTS_ROUTE } from '../../../app/route-configs/EventsRouteConfig'
import { WOHNEN_ROUTE } from '../../../app/route-configs/WohnenRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../../app/route-configs/SprungbrettRouteConfig'
import { SEARCH_ROUTE } from '../../../app/route-configs/SearchRouteConfig'
import { DISCLAIMER_ROUTE } from '../../../app/route-configs/DisclaimerRouteConfig'
import createLocation from '../../../../createLocation'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

jest.mock('react-i18next')
jest.mock('redux-first-router-link')

describe('FeedbackBoxContainer', () => {
  const cities = new CityModelBuilder(1).build()
  const t = (key: ?string): string => key || ''
  const location = createLocation({
    type: CATEGORIES_ROUTE,
    payload: { city: 'augsburg', language: 'de' },
    query: { feedback: 'up' }
  })

  it('should match snapshot', () => {
    expect(
      shallow(
        <FeedbackBoxContainer
          location={location}
          query='ab'
          cities={cities}
          path='path'
          title='title'
          alias='alias'
          isPositiveRatingSelected
          offers={null}
          t={t}
          onSubmit={() => {}}
          closeFeedbackModal={() => {}}
          sendingStatus='SUCCESS'
        />
      )
    ).toMatchSnapshot()
  })

  it('should post data on submit', () => {
    const mockPostFeedbackData = jest.fn()

    const component = shallow(
      <FeedbackBoxContainer
        location={location}
        query='ab'
        cities={cities}
        path='path'
        title='title'
        alias='alias'
        isPositiveRatingSelected
        onSubmit={() => {}}
        closeFeedbackModal={() => {}}
        offers={null}
        postFeedbackDataOverride={mockPostFeedbackData}
        sendingStatus='SUCCESS'
        t={t}
      />
    )

    component.instance().handleSubmit()
    expect(mockPostFeedbackData).toHaveBeenCalledTimes(1)
  })

  it('should not post data on submit failure', async () => {
    const mockOnSubmit = jest.fn()

    const component = shallow(
      <FeedbackBoxContainer
        location={location}
        cities={cities}
        isPositiveRatingSelected
        onSubmit={mockOnSubmit}
        closeFeedbackModal={() => {}}
        offers={null}
        sendingStatus='ERROR'
        t={t}
      />
    )

    const instance = component.instance()
    instance.postFeedbackData = jest.fn().mockRejectedValue(new Error('Endpoint request failed'))

    await instance.submitFeedback()
    expect(mockOnSubmit).toHaveBeenCalledWith('ERROR')
  })

  it('should update state onCommentChanged', () => {
    const instance = shallow(
      <FeedbackBoxContainer
        location={location}
        query='ab'
        cities={cities}
        path='path'
        title='title'
        alias='alias'
        isPositiveRatingSelected
        onSubmit={() => {}}
        closeFeedbackModal={() => {}}
        offers={null}
        sendingStatus='SUCCESS'
        t={t}
      />
    ).instance()

    const prevState = instance.state
    // $FlowFixMe
    instance.handleCommentChanged({ target: { value: 'new comment' } })
    expect(prevState).not.toEqual(instance.state)
    expect(instance.state.comment).toEqual('new comment')
  })

  it('should update state onFeedbackOptionChanged', () => {
    const instance = shallow(
      <FeedbackBoxContainer
        location={location}
        query='ab'
        cities={cities}
        path='path'
        title='title'
        alias='alias'
        isPositiveRatingSelected
        onSubmit={() => {}}
        closeFeedbackModal={() => {}}
        offers={null}
        sendingStatus='SUCCESS'
        t={t}
      />
    ).instance()

    const prevState = instance.state
    instance.handleFeedbackOptionChanged(prevState.feedbackOptions[1])
    expect(prevState).not.toEqual(instance.state)
    expect(instance.state.selectedFeedbackOption).toEqual(prevState.feedbackOptions[1])
  })
})
