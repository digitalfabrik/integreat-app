import React from 'react'
import { shallow } from 'enzyme'
import CategoriesToolbar from '../CategoriesToolbar'
import CategoriesMapModelBuilder from '../../../../api-client/src/testing/CategoriesMapModelBuilder'

describe('CategoriesToolbar', () => {

  const t = key => key
  const city = 'augsburg'
  const language = 'de'
  const category = new CategoriesMapModelBuilder(city, language).build()[0]

  it('should render nothing, if category cannot be found', () => {
    const component = shallow(
      <CategoriesToolbar
        category={category}
        cityCode={city}
        languageCode={language}
        openFeedbackModal={() => {}}
        viewportSmall
      />
    )

    expect(component.getElement()).toBeNull()
  })

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
