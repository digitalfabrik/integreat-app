import React from 'react'
import { CategoryTimeStamp } from '../CategoryTimeStamp'
import { shallow } from 'enzyme'

describe('CategoryTimeStamp', () => {
  it('should match snapshot', () => {
    expect(shallow(
      <CategoryTimeStamp timestamp={'1.Januar 2017'} t={key => key} />
    )).toMatchSnapshot()
  })
})
