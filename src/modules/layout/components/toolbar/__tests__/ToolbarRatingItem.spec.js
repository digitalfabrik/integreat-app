import React from 'react'
import { shallow } from 'enzyme'

import { ToolbarRatingItem } from '../ToolbarRatingItem'

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
})
