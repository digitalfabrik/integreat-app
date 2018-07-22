import React from 'react'
import { mount, shallow } from 'enzyme'

import { ToolbarRatingItem } from '../ToolbarRatingItem'
import categoriesFeedback from '../../../../endpoint/endpoints/feedback/categoriesFeedback'

describe('ToolbarRatingItem', () => {
  it('should render a positive ToolbarRatingItem', () => {
    const component = shallow(
      <ToolbarRatingItem city={'augsburg'} language={'de'} t={(key) => key} isPositiveRating pageId={1234} />
    )
    expect(component).toMatchSnapshot()
  })

  it('should render a negative ToolbarRatingItem', () => {
    const component = shallow(
      <ToolbarRatingItem city={'augsburg'} language={'de'} t={(key) => key} isPositiveRating={false} pageId={1234} />
    )
    expect(component).toMatchSnapshot()
  })

  it('should post a feedback onClick', () => {
    const original = categoriesFeedback.postData
    categoriesFeedback.postData = jest.fn()

    const component = mount(
      <ToolbarRatingItem city={'augsburg'} language={'de'} t={(key) => key} isPositiveRating={false} pageId={1234} />
    )
    component.simulate('click')
    expect(categoriesFeedback.postData).toHaveBeenCalledWith({
      city: 'augsburg',
      language: 'de',
      isPositiveRating: false,
      id: 1234,
      comment: undefined
    })

    categoriesFeedback.postData = original
  })
})
