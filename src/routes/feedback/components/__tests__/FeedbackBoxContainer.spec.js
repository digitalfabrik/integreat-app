// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { FeedbackBoxContainer } from '../FeedbackBoxContainer'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import { CATEGORIES_ROUTE } from '../../../../modules/app/routes/categories'
import FeedbackEndpoint, {
  CATEGORIES_FEEDBACK_TYPE, EVENTS_FEEDBACK_TYPE, EXTRA_FEEDBACK_TYPE, EXTRAS_FEEDBACK_TYPE
} from '../../../../modules/endpoint/FeedbackEndpoint'
import FeedbackDropdownItem from '../../FeedbackDropdownItem'
import { EXTRAS_ROUTE } from '../../../../modules/app/routes/extras'
import { EVENTS_ROUTE } from '../../../../modules/app/routes/events'
import ExtraModel from '../../../../modules/endpoint/models/ExtraModel'

jest.mock('../../../../modules/endpoint/FeedbackEndpoint')

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
  const location = {type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}, query: {feedback: 'up'}}

  it('should match snapshot', () => {
    expect(shallow(
      <FeedbackBoxContainer
        location={location}
        query={'ab'}
        cities={cities}
        id={1234}
        title={'title'}
        alias='alias'
        isPositiveRatingSelected
        isOpen
        extras={null}
        t={t} />
    )).toMatchSnapshot()
  })

  it('should post feedback and if feedback is opened', () => {
    const component = shallow(
      <FeedbackBoxContainer
        location={location}
        query={'ab'}
        cities={cities}
        id={1234}
        title={'title'}
        alias='alias'
        isPositiveRatingSelected
        isOpen={false}
        extras={null}
        t={t} />
    )

    const prevPostData = FeedbackEndpoint.postData
    // $FlowFixMe, flow claims methods are not writable
    FeedbackEndpoint.postData = jest.fn()

    component.setProps({isOpen: true})
    expect(FeedbackEndpoint.postData).toHaveBeenCalledTimes(1)
    // $FlowFixMe
    FeedbackEndpoint.postData = prevPostData
  })

  describe('getFeedbackOptions', () => {
    it('should add an option for the current page if returned by getCurrentPageFeedbackOption', () => {
      const instance = shallow(
        <FeedbackBoxContainer
          location={location}
          query={'ab'}
          cities={cities}
          id={1234}
          title={'title'}
          alias='alias'
          isPositiveRatingSelected
          isOpen={false}
          extras={null}
          t={t} />
      ).instance()

      const option = new FeedbackDropdownItem('value', EXTRAS_FEEDBACK_TYPE)
      instance.getCurrentPageFeedbackOption = jest.fn(() => option)
      expect(instance.getFeedbackOptions()).toContain(option)

      instance.getCurrentPageFeedbackOption = jest.fn(() => null)
      expect(instance.getFeedbackOptions()).not.toContain(null)
    })

    it('should add an option for the content if returned by getContentFeedbackOption', () => {
      const instance = shallow(
        <FeedbackBoxContainer
          location={location}
          query={'ab'}
          cities={cities}
          id={1234}
          title={'title'}
          alias='alias'
          isPositiveRatingSelected
          isOpen={false}
          extras={null}
          t={t} />
      ).instance()

      const option = new FeedbackDropdownItem('another value', EXTRAS_FEEDBACK_TYPE)
      instance.getContentFeedbackOption = jest.fn(() => option)
      expect(instance.getFeedbackOptions()).toContain(option)

      instance.getContentFeedbackOption = jest.fn(() => null)
      expect(instance.getFeedbackOptions()).not.toContain(null)
    })

    it('should add all options returned by getExtrasFeedbackOptions', () => {
      const instance = shallow(
        <FeedbackBoxContainer
          location={location}
          query={'ab'}
          cities={cities}
          id={1234}
          title={'title'}
          alias='alias'
          isPositiveRatingSelected
          isOpen={false}
          extras={null}
          t={t} />
      ).instance()

      const options = [
        new FeedbackDropdownItem('value1', EXTRA_FEEDBACK_TYPE, 'alias1'),
        new FeedbackDropdownItem('value2', EXTRA_FEEDBACK_TYPE, 'alias2')
      ]
      instance.getExtrasFeedbackOptions = jest.fn(() => options)
      expect(instance.getFeedbackOptions()).toContain(options[0])
      expect(instance.getFeedbackOptions()).toContain(options[1])
    })

    it('should add a technical feedback option', () => {
      const instance = shallow(
        <FeedbackBoxContainer
          location={location}
          query={'ab'}
          cities={cities}
          id={1234}
          title={'title'}
          alias='alias'
          isPositiveRatingSelected
          isOpen={false}
          extras={null}
          t={t} />
      ).instance()

      expect(instance.getFeedbackOptions())
        .toContainEqual(new FeedbackDropdownItem('technicalTopics', CATEGORIES_FEEDBACK_TYPE))
    })
  })

  it('getContentFeedbackOption should return the right option', () => {
    const categoriesLocation = {type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}}
    const extrasLocation = {type: EXTRAS_ROUTE, payload: {city: 'augsburg', language: 'de'}}
    const eventsLocation = {type: EVENTS_ROUTE, payload: {city: 'augsburg', language: 'de'}}

    const component = shallow(
      <FeedbackBoxContainer
        location={categoriesLocation}
        query={'ab'}
        cities={cities}
        id={1234}
        title={'title'}
        alias='alias'
        isPositiveRatingSelected
        isOpen={false}
        extras={null}
        t={t} />
    )
    expect(component.instance().getContentFeedbackOption())
      .toEqual(new FeedbackDropdownItem('contentOfCity Augsburg', CATEGORIES_FEEDBACK_TYPE))

    component.setProps({location: extrasLocation})
    expect(component.instance().getContentFeedbackOption())
      .toEqual(new FeedbackDropdownItem('contentOfCity Augsburg', EXTRAS_FEEDBACK_TYPE))

    component.setProps({location: eventsLocation})
    expect(component.instance().getContentFeedbackOption())
      .toEqual(new FeedbackDropdownItem('contentOfCity Augsburg', EVENTS_FEEDBACK_TYPE))

    component.setProps({cities: null})
    expect(component.instance().getContentFeedbackOption()).toBeUndefined()
  })

  it('getExtrasFeedbackOptions should return the right options', () => {
    const extrasLocation = {type: EXTRAS_ROUTE, payload: {city: 'augsburg', language: 'de'}}
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
        path: 'https://web.integreat-app.de/proxy/sprungbrett/app-search-internships?location=augsburg',
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
        query={'ab'}
        cities={cities}
        id={1234}
        title={'title'}
        alias='alias'
        isPositiveRatingSelected
        isOpen={false}
        extras={extras}
        t={t} />
    )

    expect(component.instance().getExtrasFeedbackOptions()).toMatchSnapshot()
  })

  /* todo requires jest version 23.0 or higher
  describe('getCurrentPageFeedbackOption', () => {
    const categoriesOption = new FeedbackDropdownItem(`contentOfPage 'Willkommen'`, PAGE_FEEDBACK_TYPE)
    const eventsOption = new FeedbackDropdownItem(`news 'Event1'`, PAGE_FEEDBACK_TYPE)
    const wohnenOption = new FeedbackDropdownItem(`extra 'Wohnungsboerse'`, PAGE_FEEDBACK_TYPE)
    const sprungbrettOption = new FeedbackDropdownItem(`extra 'Sprungbrett'`, EXTRA_FEEDBACK_TYPE)
    const searchOption = new FeedbackDropdownItem(`searchFor 'myquery'`, SEARCH_FEEDBACK_TYPE)
    const disclaimerOption = new FeedbackDropdownItem(`disclaimer`, PAGE_FEEDBACK_TYPE)
    const extrasOption = null

    it.each`
    type                 | id      | alias           | title              | query         | result
    ${CATEGORIES_ROUTE}  | ${1234} | ${''}           | ${'Willkommen'}    | ${''}         | ${categoriesOption}
    ${EVENTS_ROUTE}      | ${5678} | ${''}           | ${'Event1'}        | ${''}         | ${eventsOption}
    ${WOHNEN_ROUTE}      | ${0}    | ${'wohnen'}     | ${'Wohnungsboerse'}| ${''}         | ${wohnenOption}
    ${SPRUNGBRETT_ROUTE} | ${0}    | ${'sprungbrett'}| ${'Sprungbrett'}   | ${''}         | ${sprungbrettOption}
    ${SEARCH_ROUTE}      | ${0}    | ${''}           | ${''}              | ${'my query'} | ${searchOption}
    ${DISCLAIMER_ROUTE}  | ${0}    | ${''}           | ${''}              | ${''}         | ${disclaimerOption}
    ${EXTRAS_ROUTE}      | ${0}    | ${''}           | ${''}              | ${''}         | ${extrasOption}
    `('should return the right option', ({type, id, alias, title, query, result}) => {
  const location = {type, payload: {city: 'augsburg', language: 'de'}}
  const component = shallow(
        <FeedbackBoxContainer
          location={location}
          query={query}
          cities={cities}
          id={id}
          title={title}
          alias={alias}
          isPositiveRatingSelected
          isOpen={false}
          extras={null}
          t={t} />
  )

  expect(component.instance().getCurrentPageFeedbackOption()).toEqual(result)
})
  }) */

  it('should post data on submit', () => {
    const component = shallow(
      <FeedbackBoxContainer
        location={location}
        query={'ab'}
        cities={cities}
        id={1234}
        title={'title'}
        alias='alias'
        isPositiveRatingSelected
        isOpen={false}
        extras={null}
        t={t} />
    )

    const prevPostData = FeedbackEndpoint.postData
    // $FlowFixMe
    FeedbackEndpoint.postData = jest.fn()

    component.instance().onSubmit()
    expect(FeedbackEndpoint.postData).toHaveBeenCalledTimes(1)
    // $FlowFixMe
    FeedbackEndpoint.postData = prevPostData
  })

  it('should update state onCommentChanged', () => {
    const instance = shallow(
      <FeedbackBoxContainer
        location={location}
        query={'ab'}
        cities={cities}
        id={1234}
        title={'title'}
        alias='alias'
        isPositiveRatingSelected
        isOpen={false}
        extras={null}
        t={t} />
    ).instance()

    const prevState = instance.state
    instance.onCommentChanged({target: {value: 'new comment'}})
    expect(prevState).not.toEqual(instance.state)
    expect(instance.state.comment).toEqual('new comment')
  })

  it('should update state onFeedbackOptionChanged', () => {
    const instance = shallow(
      <FeedbackBoxContainer
        location={location}
        query={'ab'}
        cities={cities}
        id={1234}
        title={'title'}
        alias='alias'
        isPositiveRatingSelected
        isOpen={false}
        extras={null}
        t={t} />
    ).instance()

    const prevState = instance.state
    instance.onFeedbackOptionChanged(prevState.feedbackOptions[1])
    expect(prevState).not.toEqual(instance.state)
    expect(instance.state.selectedFeedbackOption).toEqual(prevState.feedbackOptions[1])
  })
})
