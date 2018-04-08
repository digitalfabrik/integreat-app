import { shallow } from 'enzyme'
import React from 'react'
import LocationHeader from '../LocationHeader'
import LanguageModel from '../../../endpoint/models/LanguageModel'
import { CATEGORIES_ROUTE } from '../../../app/routes/categories'
import { EVENTS_ROUTE } from '../../../app/routes/events'
import { EXTRAS_ROUTE } from '../../../app/routes/extras'

describe('LocationHeader', () => {
  const languages = [
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('en', 'English'),
    new LanguageModel('ar', 'Arabic')
  ]

  const language = 'de'
  const city = 'augsburg'

  describe('NavigationItems', () => {
    it('should be empty, if extras and news are both disabled', () => {
      const component = shallow(<LocationHeader city={city}
                                                language={language}
                                                languages={languages}
                                                isExtrasEnabled={false}
                                                isEventsEnabled={false}
                                                isEventsActive={false}
                                                currentRoute='RANDOM_ROUTE'
                                                viewportSmall />)
      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })

    it('should show categories, if extras or news are enabled', () => {
      const extrasComp = shallow(<LocationHeader city={city}
                                                 language={language}
                                                 languages={languages}
                                                 isExtrasEnabled
                                                 isEventsEnabled={false}
                                                 isEventsActive={false}
                                                 currentRoute='RANDOM_ROUTE'
                                                 viewportSmall />)
      const eventsComp = shallow(<LocationHeader city={city}
                                                 language={language}
                                                 languages={languages}
                                                 isExtrasEnabled={false}
                                                 isEventsEnabled
                                                 isEventsActive={false}
                                                 currentRoute='RANDOM_ROUTE'
                                                 viewportSmall />)

      expect(extrasComp.dive().prop('navigationItems')).toMatchSnapshot()
      expect(eventsComp.dive().prop('navigationItems')).toMatchSnapshot()
    })

    it('should show extras, categories, events in this order', () => {
      const component = shallow(<LocationHeader city={city}
                                                language={language}
                                                languages={languages}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                isEventsActive={false}
                                                currentRoute='RANDOM_ROUTE'
                                                viewportSmall />)
      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })

    it('should highlight categories if route corresponds', () => {
      const component = shallow(<LocationHeader city={city}
                                                language={language}
                                                languages={languages}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                isEventsActive={false}
                                                currentRoute={CATEGORIES_ROUTE}
                                                viewportSmall />)
      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })

    it('should highlight events if route corresponds', () => {
      const component = shallow(<LocationHeader city={city}
                                                language={language}
                                                languages={languages}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                isEventsActive={false}
                                                currentRoute={EVENTS_ROUTE}
                                                viewportSmall />)

      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })

    it('should highlight extras if extras route is selected', () => {
      const component = shallow(<LocationHeader city={city}
                                                language={language}
                                                languages={languages}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                isEventsActive={false}
                                                currentRoute={EXTRAS_ROUTE}
                                                viewportSmall />)

      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })
  })

  it('should match snapshot', () => {
    const component = shallow(<LocationHeader city={city}
                                              language={language}
                                              languages={languages}
                                              isExtrasEnabled
                                              isEventsEnabled
                                              isEventsActive={false}
                                              currentRoute='RANDOM_ROUTE'
                                              viewportSmall />)
    expect(component.dive()).toMatchSnapshot()
  })

  // fixme: Test the events enabled functionality. Especially isEventsActive()
})
