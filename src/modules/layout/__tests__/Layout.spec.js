import renderer from 'react-test-renderer'
import Layout from '../components/Layout'
import React from 'react'

describe('Layout', () => {
  test('should match snapshot', () => {
    const component = renderer.create(
      <Layout header={<header />} footer={<footer />}>Here comes the main content.</Layout>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
