import React from 'react'
import { shallow } from 'enzyme'
import CategoriesToolbar from '../CategoriesToolbar'
import { CategoriesMapModelBuilder } from 'api-client'

jest.mock('react-i18next')

describe('CategoriesToolbar', () => {
  const city = 'augsburg'
  const language = 'de'
  const categories = new CategoriesMapModelBuilder(city, language).build().toArray()

  it('should render Toolbar, if category can be found', () => {
    const component = shallow(
      <CategoriesToolbar
        viewportSmall
        category={categories[1]}
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
        category={categories[0]}
        cityCode={city}
        languageCode={language}
        openFeedbackModal={() => {}}
      />
    )

    expect(component).toMatchSnapshot()
  })
})
