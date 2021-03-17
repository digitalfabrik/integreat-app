// @flow

import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import lightTheme from '../../../../modules/theme/constants'
import Events from '../Events'
import EventModelBuilder from 'api-client/src/testing/EventModelBuilder'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import Page from '../../../../modules/common/components/Page'
import EventListItem from '../EventListItem'
import { EventModel } from 'api-client'

describe('EventListItem', () => {
  const city = 'augsburg'
  const language = 'de'


  beforeAll(() => {

  })

  it('should use a placeholder instead if not thumbnail present', () => {
    const events = new EventModelBuilder('event', 1, city, language)
    const event = events[0]
    event.thumbnail = null
    const { getByText } = render(<EventListItem cityCode={city} event={} language={} navigateTo={} theme={} />)
  })
})
