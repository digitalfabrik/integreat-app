import React from 'react'
import { Link } from 'redux-little-router'
import { branch, mapProps, renderComponent } from 'recompose'
import { omit } from 'lodash/object'

export class InactiveLink extends React.Component {
  render () {
    return <span {...this.props} />
  }
}

/**
 * mapProps() without 'active' in props
 */
const omitActive = mapProps(props => omit(props, 'active'))

/**
 * Component ConditionalLink.
 * If prop.active === true, returns a redux-little-router Link
 * else: returns a InactiveLink (has the same LAF, but is not clickable)
 * In both cases the returned component does not have props.active set.
 */
export default branch(
  props => props.active,
  renderComponent(omitActive(Link)),
  renderComponent(omitActive(InactiveLink))
)()
