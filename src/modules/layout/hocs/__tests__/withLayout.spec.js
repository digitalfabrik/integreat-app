import React from 'react'
import { mount, shallow } from 'enzyme'
import withLayout from '../withLayout'

describe('withLayout', () => {
  const Header = () => <header />
  const Toolbar = () => <div />
  const Footer = () => <footer />
  const MainContent = () => <main />

  it('should match snapshot with passed props', () => {
    const Layouted = withLayout(Header, Toolbar, Footer)(MainContent)
    const component = shallow(<Layouted customProp='test' />)
    expect(component).toMatchSnapshot()
  })

  it('should add stickyTopCallback to Header', () => {
    const Layouted = withLayout(Header, Toolbar, Footer)(MainContent)
    const component = shallow(<Layouted />)
    component.find(Header).prop('onStickyTopChanged')(50)
    component.update()
    expect(component.find('aside').prop('style')).toEqual({top: '50px'})
  })

  it('should mount without additional components', () => {
    const Layouted = withLayout(null, null, null)(MainContent)
    expect(() => mount(<Layouted />)).not.toThrow()
  })
})
