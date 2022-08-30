import * as React from 'react'
import TestRenderer from 'react-test-renderer'

import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import EventModelBuilder from 'api-client/src/testing/EventModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'

import Page from '../../components/Page'
import Events from '../Events'

jest.mock('react-i18next')

jest.mock('../../components/Page', () => {
  const { Text } = require('react-native')

  return () => <Text>Page</Text>
})
jest.mock('../../components/PageDetail', () => {
  const { Text } = require('react-native')

  return () => <Text>PageDetail</Text>
})
describe('Events', () => {
  const cityModel = new CityModelBuilder(1).build()[0]!
  const language = new LanguageModelBuilder(1).build()[0]!
  const events = new EventModelBuilder('Events-component', 1, cityModel.code, language.code).build()
  const event = events[0]!

  it('should pass an empty object to Page if the resource cache doesnt contain an appropriate entry', () => {
    const result = TestRenderer.create(
      <Events
        refresh={jest.fn()}
        path={event.path}
        events={events}
        cityModel={cityModel}
        resourceCacheUrl='http://localhost:8080'
        language={language.code}
        resourceCache={{
          notAvailable: {},
        }}
        navigateTo={() => undefined}
        navigateToFeedback={() => undefined}
      />
    )
    const pageInstance = result.root.findByType(Page)
    expect(pageInstance.props).toEqual(
      expect.objectContaining({
        files: {},
      })
    )
  })
})
