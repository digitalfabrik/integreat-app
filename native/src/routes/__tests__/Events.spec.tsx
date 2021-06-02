import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import Events from '../Events'
import EventModelBuilder from 'api-client/dist/src/testing/EventModelBuilder'
import CityModelBuilder from 'api-client/dist/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/dist/src/testing/LanguageModelBuilder'
import Page from '../../components/Page'
import buildConfig from '../../constants/buildConfig'

jest.mock('../../components/Page', () => {
  const Text = require('react-native').Text

  return () => <Text>Page</Text>
})
jest.mock('../../components/PageDetail', () => {
  const Text = require('react-native').Text

  return () => <Text>PageDetail</Text>
})
describe('Events', () => {
  const [cityModel] = new CityModelBuilder(1).build()
  const [language] = new LanguageModelBuilder(1).build()
  const events = new EventModelBuilder('Events-component', 1, cityModel.code, language.code).build()
  const event = events[0]
  it('should pass an empty object to Page if the resource cache doesnt contain an appropriate entry', () => {
    const result = TestRenderer.create(
      <Events
        path={event.path}
        events={events}
        cityModel={cityModel}
        resourceCacheUrl='http://localhost:8080'
        language={language.code}
        resourceCache={{
          notAvailable: {}
        }}
        theme={buildConfig().lightTheme}
        t={key => key}
        navigateTo={() => {}}
        navigateToLink={() => {}}
        navigateToFeedback={() => {}}
      />
    )
    const pageInstance = result.root.findByType(Page)
    expect(pageInstance.props).toEqual(
      expect.objectContaining({
        files: {}
      })
    )
  })
})
