import React from 'react'
import { shallow } from 'enzyme'
import RemoteContent from '../RemoteContent'

describe('RemoteContent', () => {
  test('should render', () => {
    expect(shallow(<RemoteContent dangerouslySetInnerHTML={{__html: '<div> Test html </div>'}} />)).toMatchSnapshot()
  })

  test('should render and have centered props', () => {
    expect(shallow(
      <RemoteContent centered dangerouslySetInnerHTML={{__html: '<div> Test html </div>'}} />
    )).toMatchSnapshot()
  })
})
