import React from 'react'
import Caption from '../Caption'
import ShallowRenderer from 'react-test-renderer/shallow'

const renderer = new ShallowRenderer()

describe('Caption', () => {
  it('should render', () => {
    expect(renderer.render(<Caption title={'Test Title'} />)).toMatchSnapshot()
  })
})
