// @flow

import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import lightTheme from '../../../../modules/theme/constants'
import Events from '../Events'
import EventModelBuilder from 'api-client/src/testing/EventModelBuilder'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import Page from '../../../../modules/common/components/Page'
import createNavigationScreenPropMock from '../../../../testing/createNavigationPropMock'

jest.mock('../../../../modules/common/components/Page', () => {
  const Text = require('react-native').Text
  return () => <Text>Page</Text>
})

jest.mock('../../../../modules/common/components/PageDetail', () => {
  const Text = require('react-native').Text
  return () => <Text>PageDetail</Text>
})

describe('Events', () => {
  it('should pass an empty object to Page if the resource cache doesnt contain an appropriate entry', () => {
    const cities = new CityModelBuilder(1).build()
    const languages = new LanguageModelBuilder(1).build()
    const city = cities[0]
    const language = languages[0]
    const events = new EventModelBuilder('Events-component', 1, city.code, language.code).build()
    const event = events[0]
    if (!city || !language || !event) {
      throw Error('Something went wrong with the builder')
    }
    const navigation = createNavigationScreenPropMock()
    const result = TestRenderer.create(
      <Events path={event.path} events={events} cities={cities} cityCode={city.code}
              resourceCacheUrl='http://localhost:8080' language={language.code} resourceCache={{ notAvailable: {} }}
              theme={lightTheme} t={key => key} navigation={navigation} navigateToEvent={() => {}}
              navigateToInternalLink={() => {}} />
    )
    const pageInstance = result.root.findByType(Page)
    expect(pageInstance.props).toEqual(expect.objectContaining({
      files: {}
    }))
  })
})
