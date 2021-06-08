import React from 'react'
import { shallow } from 'enzyme'
import CategoriesToolbar from '../CategoriesToolbar'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'

jest.mock('react-i18next')

describe('CategoriesToolbar', () => {
  const city = 'augsburg'
  const language = 'de'
  const category = new CategoriesMapModelBuilder(city, language).build()[0]

  it('should render Toolbar, if category can be found', () => {
    const component = shallow(
      <CategoriesToolbar
        viewportSmall
        category={category}
        cityCode={city}
        languageCode={language}
        openFeedbackModal={() => {}}
      />
    )

    expect(component).toMatchSnapshot()
  })

  it('should render root-url for pdf endpoint', () => {
    const component = shallow(
      <CategoriesToolbar
        viewportSmall
        category={category}
        cityCode={city}
        languageCode={language}
        openFeedbackModal={() => {}}
      />
    )

    expect(component).toMatchSnapshot()
  })
})
