// @flow

export const toHaveDirection = (received: Array<ReactTestInstance>) => {
  if (received.every(instance => instance.props.style.some(style => style.flexDirection === 'row'))) {
    return {
      message: () =>
        `expected received components not to have direction`,
      pass: true
    }
  } else {
    return {
      message: () =>
        `expected received components to have direction`,
      pass: false
    }
  }
}
