import React from 'react'
import { mount, shallow } from 'enzyme'
import Headroom from '../Headroom'
import raf from 'raf'

jest.mock('raf', () => jest.fn())

describe('Headroom', () => {
  const MockNode = () => <div />
  const MockAncestor = () => <div />

  const createComponent = props => mount(
    <Headroom scrollHeight={50}
              height={100}
              stickyAncestor={<MockAncestor />}
              {...props}>
      <MockNode />
    </Headroom>)

  test('should have correct default state', () => {
    const component = createComponent()
    expect(component.state()).toEqual({transform: 0, stickyTop: 0})
    expect(component.prop('pinStart')).toEqual(0)
  })

  test('should render with values from its state', () => {
    const component = createComponent()
    component.setState({transform: 42, stickyTop: 24})
    expect(component).toMatchSnapshot()
  })

  test('should render with no stickyAncestor supplied', () => {
    const component = shallow(
      <Headroom scrollHeight={50}><MockNode /></Headroom>)
    expect(component).toMatchSnapshot()
  })

  test('should attach and detach listener for onscroll event', () => {
    const originalAdd = window.addEventListener
    const originalRemove = window.removeEventListener
    window.addEventListener = jest.fn()
    window.removeEventListener = jest.fn()

    const component = mount(<Headroom scrollHeight={50}><MockNode /></Headroom>)
    const handleEventCallback = component.instance().handleEvent
    expect(window.addEventListener).toHaveBeenCalledWith('scroll', handleEventCallback)
    component.unmount()
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', handleEventCallback)

    window.addEventListener = originalAdd
    window.removeEventListener = originalRemove
  })

  test('should lock, request animation frame and update, on handleEvent', () => {
    const component = mount(<Headroom scrollHeight={50}><MockNode /></Headroom>)
    component.instance().update = jest.fn()

    // Call first time
    component.instance().handleEvent()
    expect(raf).toHaveBeenCalledTimes(1)
    // Raf has not yet been performed
    expect(component.instance().update).not.toHaveBeenCalled()

    // Check that we cannot call Raf a second time (as long as it hasn't been performed)
    component.instance().handleEvent()
    expect(raf.mock.calls).toHaveLength(1)

    // Now perform the raf
    raf.mock.calls[0][0]()
    expect(component.instance().update).toHaveBeenCalledTimes(1)

    // Should have unlocked again
    component.instance().handleEvent()
    expect(raf).toHaveBeenCalledTimes(2)
  })

  describe('update', () => {
    const pinStart = 10
    const height = 100
    const scrollHeight = 50
    test('should set correct state, if user hasn\'t scrolled beyond pinStart', () => {
      const component = createComponent({pinStart, height, scrollHeight})
      const scrollTo = (scrollTo) => {
        window.pageYOffset = scrollTo
        component.instance().update()
      }
      scrollTo(0)
      scrollTo(pinStart / 2)
      expect(component.state()).toEqual({transform: 0, stickyTop: height - scrollHeight})
    })

    test('should set correct state, if user has scrolled down to pinStart + scrollHeight/2', () => {
      const component = createComponent({pinStart, height, scrollHeight})
      const scrollTo = (scrollTo) => {
        window.pageYOffset = scrollTo
        component.instance().update()
      }

      scrollTo(0)
      scrollTo(pinStart + scrollHeight / 2)
      expect(component.state()).toEqual({transform: -scrollHeight / 2, stickyTop: height - scrollHeight})
    })

    test('should set correct state, if user has scrolled down and back up again', () => {
      const component = createComponent({pinStart, height, scrollHeight})
      const scrollTo = (scrollTo) => {
        window.pageYOffset = scrollTo
        component.instance().update()
      }

      scrollTo(pinStart)
      expect(component.state()).toEqual({transform: 0, stickyTop: height - scrollHeight})

      const offset = 5
      scrollTo(pinStart + scrollHeight)
      // Header is completely transformed to the top
      expect(component.state()).toEqual({transform: -scrollHeight, stickyTop: height - scrollHeight})

      scrollTo(pinStart + scrollHeight - offset)
      // Header is partially transformed
      expect(component.state()).toEqual({
        transform: -(scrollHeight - offset),
        stickyTop: height - scrollHeight + offset
      })

      scrollTo(pinStart)
      expect(component.state()).toEqual({transform: 0, stickyTop: height - scrollHeight})
    })
  })
})
