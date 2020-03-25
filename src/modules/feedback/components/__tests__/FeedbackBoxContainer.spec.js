// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { FeedbackBoxContainer } from '../FeedbackBoxContainer'
import { CATEGORIES_ROUTE } from '../../../app/route-configs/CategoriesRouteConfig'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CityModel,
  EVENTS_FEEDBACK_TYPE,
  EXTRA_FEEDBACK_TYPE,
  ExtraModel,
  EXTRAS_FEEDBACK_TYPE,
  PAGE_FEEDBACK_TYPE,
  SEARCH_FEEDBACK_TYPE
} from '@integreat-app/integreat-api-client'
import FeedbackDropdownItem from '../../FeedbackDropdownItem'
import { EXTRAS_ROUTE } from '../../../app/route-configs/ExtrasRouteConfig'
import { EVENTS_ROUTE } from '../../../app/route-configs/EventsRouteConfig'
import { WOHNEN_ROUTE } from '../../../app/route-configs/WohnenRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../../app/route-configs/SprungbrettRouteConfig'
import { SEARCH_ROUTE } from '../../../app/route-configs/SearchRouteConfig'
import { DISCLAIMER_ROUTE } from '../../../app/route-configs/DisclaimerRouteConfig'
import createLocation from '../../../../createLocation'
import {
  CONTENT_FEEDBACK_CATEGORY,
  TECHNICAL_FEEDBACK_CATEGORY
} from '@integreat-app/integreat-api-client/endpoints/createFeedbackEndpoint'

describe('FeedbackBoxContainer', () => {
  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false,
      sortingName: 'Augsburg'
    })
  ]
  const t = (key: ?string): string => key || ''
  const location = createLocation(
    { type: CATEGORIES_ROUTE, payload: { city: 'augsburg', language: 'de' }, query: { feedback: 'up' } })

  it('should match snapshot', () => {
    expect(shallow(
      <FeedbackBoxContainer
        location={location}
        query='ab'
        cities={cities}
        id={1234}
        title='title'
        alias='alias'
        isPositiveRatingSelected
        extras={null}
        t={t}
        onSubmit={() => {}}
        closeFeedbackModal={() => {}} />
    )).toMatchSnapshot()
  })

  describe('getFeedbackOptions', () => {
    it('should add an option for the current page if returned by getCurrentPageFeedbackOption', () => {
      const instance = shallow(
        <FeedbackBoxContainer
          location={location}
          query='ab'
          cities={cities}
          id={1234}
          title='title'
          alias='alias'
          isPositiveRatingSelected
          onSubmit={() => {}}
          closeFeedbackModal={() => {}}
          extras={null}
          t={t} />
      ).instance()

      const option = new FeedbackDropdownItem({
        label: 'value',
        feedbackType: EXTRAS_FEEDBACK_TYPE,
        feedbackCategory: CONTENT_FEEDBACK_CATEGORY
      })
      instance.getCurrentPageFeedbackOption = jest.fn(() => option)
      expect(instance.getFeedbackOptions()).toContain(option)

      instance.getCurrentPageFeedbackOption = jest.fn(() => null)
      expect(instance.getFeedbackOptions()).not.toContain(null)
    })

    it('should add an option for the content if returned by getContentFeedbackOption', () => {
      const instance = shallow(
        <FeedbackBoxContainer
          location={location}
          query='ab'
          cities={cities}
          id={1234}
          title='title'
          alias='alias'
          isPositiveRatingSelected
          onSubmit={() => {}}
          closeFeedbackModal={() => {}}
          extras={null}
          t={t} />
      ).instance()

      const option = new FeedbackDropdownItem({
        label: 'another value',
        feedbackType: EXTRAS_FEEDBACK_TYPE,
        feedbackCategory: CONTENT_FEEDBACK_CATEGORY
      })
      instance.getContentFeedbackOption = jest.fn(() => option)
      expect(instance.getFeedbackOptions()).toContain(option)

      instance.getContentFeedbackOption = jest.fn(() => null)
      expect(instance.getFeedbackOptions()).not.toContain(null)
    })

    it('should add all options returned by getExtrasFeedbackOptions', () => {
      const instance = shallow(
        <FeedbackBoxContainer
          location={location}
          query='ab'
          cities={cities}
          id={1234}
          title='title'
          alias='alias'
          isPositiveRatingSelected
          onSubmit={() => {}}
          closeFeedbackModal={() => {}}
          extras={null}
          t={t} />
      ).instance()

      const options = [
        new FeedbackDropdownItem({
          label: 'value1',
          feedbackType: EXTRA_FEEDBACK_TYPE,
          feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
          alias: 'alias1'
        }),
        new FeedbackDropdownItem({
          label: 'value2',
          feedbackType: EXTRA_FEEDBACK_TYPE,
          feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
          alias: 'alias2'
        })
      ]
      instance.getExtrasFeedbackOptions = jest.fn(() => options)
      expect(instance.getFeedbackOptions()).toContain(options[0])
      expect(instance.getFeedbackOptions()).toContain(options[1])
    })

    it('should add a technical feedback option', () => {
      const instance = shallow(
        <FeedbackBoxContainer
          location={location}
          query='ab'
          cities={cities}
          id={1234}
          title='title'
          alias='alias'
          isPositiveRatingSelected
          onSubmit={() => {}}
          closeFeedbackModal={() => {}}
          extras={null}
          t={t} />
      ).instance()

      expect(instance.getFeedbackOptions())
        .toContainEqual(new FeedbackDropdownItem({
          label: 'technicalTopics',
          feedbackCategory: TECHNICAL_FEEDBACK_CATEGORY,
          feedbackType: CATEGORIES_FEEDBACK_TYPE
        }))
    })
  })

  it('getContentFeedbackOption should return the right option', () => {
    const categoriesLocation = createLocation({ type: CATEGORIES_ROUTE, payload: { city: 'augsburg', language: 'de' } })
    const extrasLocation = createLocation({ type: EXTRAS_ROUTE, payload: { city: 'augsburg', language: 'de' } })
    const eventsLocation = createLocation({ type: EVENTS_ROUTE, payload: { city: 'augsburg', language: 'de' } })

    const component = shallow(
      <FeedbackBoxContainer
        location={categoriesLocation}
        query='ab'
        cities={cities}
        id={1234}
        title='title'
        alias='alias'
        isPositiveRatingSelected
        onSubmit={() => {}}
        closeFeedbackModal={() => {}}
        extras={null}
        t={t} />
    )
    expect(component.instance().getContentFeedbackOption())
      .toEqual(new FeedbackDropdownItem({
        label: 'contentOfCity Augsburg',
        feedbackType: CATEGORIES_FEEDBACK_TYPE,
        feedbackCategory: CONTENT_FEEDBACK_CATEGORY
      }))

    component.setProps({ location: extrasLocation })
    expect(component.instance().getContentFeedbackOption())
      .toEqual(new FeedbackDropdownItem({
        label: 'contentOfCity Augsburg',
        feedbackType: EXTRAS_FEEDBACK_TYPE,
        feedbackCategory: CONTENT_FEEDBACK_CATEGORY
      }))

    component.setProps({ location: eventsLocation })
    expect(component.instance().getContentFeedbackOption())
      .toEqual(new FeedbackDropdownItem({
        label: 'contentOfCity Augsburg',
        feedbackType: EVENTS_FEEDBACK_TYPE,
        feedbackCategory: CONTENT_FEEDBACK_CATEGORY
      }))

    component.setProps({ cities: null })
    expect(component.instance().getContentFeedbackOption()).toBeUndefined()
  })

  it('getExtrasFeedbackOptions should return the right options', () => {
    const extrasLocation = createLocation({ type: EXTRAS_ROUTE, payload: { city: 'augsburg', language: 'de' } })
    const extras = [
      new ExtraModel({
        alias: 'serlo-abc',
        thumbnail: 'some_thumbnail',
        title: 'Serlo ABC',
        path: 'https://abc-app.serlo.org/',
        postData: null
      }),
      new ExtraModel({
        alias: 'sprungbrett',
        thumbnail: 'some_other_thumbnail',
        title: 'Sprungbrett',
        path: 'https://integreat.app/proxy/sprungbrett/app-search-internships?location=augsburg',
        postData: null
      }),
      new ExtraModel({
        alias: 'lehrstellen-radar',
        thumbnail: 'some_other_thumbnail',
        title: 'Lehrstellenradar',
        path: 'https://www.lehrstellen-radar.de/5100,0,lsrlist.html',
        postData: null
      })
    ]
    const component = shallow(
      <FeedbackBoxContainer
        location={extrasLocation}
        query='ab'
        cities={cities}
        id={1234}
        title='title'
        alias='alias'
        isPositiveRatingSelected
        onSubmit={() => {}}
        closeFeedbackModal={() => {}}
        extras={extras}
        t={t} />
    )

    expect(component.instance().getExtrasFeedbackOptions()).toMatchSnapshot()
  })

  describe('getCurrentPageFeedbackOption', () => {
    const categoriesOption = new FeedbackDropdownItem({
      label: 'contentOfPage',
      feedbackType: PAGE_FEEDBACK_TYPE,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY
    })
    const eventsOption = new FeedbackDropdownItem({
      label: 'contentOfEvent',
      feedbackType: PAGE_FEEDBACK_TYPE,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY
    })
    const wohnenOption = new FeedbackDropdownItem({
      label: 'contentOfExtra',
      feedbackType: EXTRA_FEEDBACK_TYPE,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY
    })
    const sprungbrettOption = new FeedbackDropdownItem({
      label: 'contentOfExtra',
      feedbackType: EXTRA_FEEDBACK_TYPE,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY
    })
    const searchOption = new FeedbackDropdownItem({
      label: 'searchFor \'my query\'',
      feedbackType: SEARCH_FEEDBACK_TYPE,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY
    })
    const disclaimerOption = new FeedbackDropdownItem({
      label: 'disclaimer',
      feedbackType: PAGE_FEEDBACK_TYPE,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY
    })
    const extrasOption = null

    // $FlowFixMe
    it.each`
    type                 | id      | alias           | title              | query         | result
    ${CATEGORIES_ROUTE}  | ${1234} | ${''}           | ${'Willkommen'}    | ${''}         | ${categoriesOption}
    ${EVENTS_ROUTE}      | ${5678} | ${''}           | ${'Event1'}        | ${''}         | ${eventsOption}
    ${WOHNEN_ROUTE}      | ${0}    | ${'wohnen'}     | ${'Wohnungsboerse'}| ${''}         | ${wohnenOption}
    ${SPRUNGBRETT_ROUTE} | ${0}    | ${'sprungbrett'}| ${'Sprungbrett'}   | ${''}         | ${sprungbrettOption}
    ${SEARCH_ROUTE}      | ${0}    | ${''}           | ${''}              | ${'my query'} | ${searchOption}
    ${DISCLAIMER_ROUTE}  | ${0}    | ${''}           | ${''}              | ${''}         | ${disclaimerOption}
    ${EXTRAS_ROUTE}      | ${0}    | ${''}           | ${''}              | ${''}         | ${extrasOption}
    `('should return the right option', ({ type, id, alias, title, query, result }) => {
  const location = createLocation({ type, payload: { city: 'augsburg', language: 'de' } })
  const component = shallow(
          <FeedbackBoxContainer
            location={location}
            query={query}
            cities={cities}
            id={id}
            title={title}
            alias={alias}
            isPositiveRatingSelected
            onSubmit={() => {}}
            closeFeedbackModal={() => {}}
            extras={null}
            t={t} />
  )

  expect(component.instance().getCurrentPageFeedbackOption()).toEqual(result)
}
)
  })

  it('should post data on submit', () => {
    const mockPostFeedbackData = jest.fn()

    const component = shallow(
      <FeedbackBoxContainer
        location={location}
        query='ab'
        cities={cities}
        id={1234}
        title='title'
        alias='alias'
        isPositiveRatingSelected
        onSubmit={() => {}}
        closeFeedbackModal={() => {}}
        extras={null}
        postFeedbackDataOverride={mockPostFeedbackData}
        t={t} />
    )

    component.instance().handleSubmit()
    expect(mockPostFeedbackData).toHaveBeenCalledTimes(1)
  })

  it('should update state onCommentChanged', () => {
    const instance = shallow(
      <FeedbackBoxContainer
        location={location}
        query='ab'
        cities={cities}
        id={1234}
        title='title'
        alias='alias'
        isPositiveRatingSelected
        onSubmit={() => {}}
        closeFeedbackModal={() => {}}
        extras={null}
        t={t} />
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
        id={1234}
        title='title'
        alias='alias'
        isPositiveRatingSelected
        onSubmit={() => {}}
        closeFeedbackModal={() => {}}
        extras={null}
        t={t} />
    ).instance()

    const prevState = instance.state
    instance.handleFeedbackOptionChanged(prevState.feedbackOptions[1])
    expect(prevState).not.toEqual(instance.state)
    expect(instance.state.selectedFeedbackOption).toEqual(prevState.feedbackOptions[1])
  })
})
