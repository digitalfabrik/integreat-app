import React from 'react'
import { shallow } from 'enzyme'
import HeaderDropDown from '../components/HeaderDropDown'

describe('HeaderDropDown', () => {
  const MockNode = () => <div>Here comes the DropDown</div>
  let wrapperComponent

  beforeEach(() => {
    wrapperComponent = shallow(<HeaderDropDown iconSrc='/someImg'>
      <MockNode />
    </HeaderDropDown>)
  })

  test('should be wrapped by onClickOutside', () => {
    // todo: ??
  })

  test('should match snapshot', () => {
    expect(wrapperComponent.dive()).toMatchSnapshot()
  })

  test('should pass correct closeDropDown callback', () => {
    const component = wrapperComponent.dive()
    expect(component.find('MockNode')).toHaveLength(1)
    const callback = component.find('MockNode').prop('closeDropDownCallback')
    expect(callback).toEqual(component.instance().closeDropDown)
  })

  describe('closeDropDown()', () => {
    test('should close DropDown if active', () => {
      const component = wrapperComponent.dive()
      component.setState({dropDownActive: true})
      component.instance().closeDropDown()
      expect(component.instance().state.dropDownActive).toBe(false)
    })

    test('shouldnt open DropDown if inactive', () => {
      const component = wrapperComponent.dive()
      component.instance().closeDropDown()
      expect(component.instance().state.dropDownActive).toBe(false)
    })
  })

  describe('toggleDropDown()', () => {
    test('should close DropDown if active', () => {
      const component = wrapperComponent.dive()
      component.setState({dropDownActive: true})
      component.instance().toggleDropDown()
      expect(component.instance().state.dropDownActive).toBe(false)
    })

    test('should open DropDown if inactive', () => {
      const component = wrapperComponent.dive()
      component.instance().toggleDropDown()
      expect(component.instance().state.dropDownActive).toBe(true)
    })
  })

  test('should toggle when user clicks on img', () => {
    const component = wrapperComponent.dive()
    const onClick = component.find('img').prop('onClick')
    expect(onClick).toBe(component.instance().toggleDropDown)
  })

  test('should call closeDropDown when handleClickOutside is called', () => {
    const component = wrapperComponent.dive()
    component.instance().closeDropDown = jest.fn()
    component.instance().handleClickOutside()
    expect(component.instance().closeDropDown).toHaveBeenCalled()
  })

  test('should be closed from the beginning', () => {
    expect(wrapperComponent.dive().instance().state.dropDownActive).toBe(false)
  })

  test('should add class if active', () => {
    const component = wrapperComponent.dive()
    expect(component.find('.dropDown').prop('className')).toEqual('dropDown')
    component.setState({dropDownActive: true})
    expect(component.find('.dropDown').prop('className')).toEqual('dropDown dropDownActive')
  })
})
