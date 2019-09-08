// @flow

/**
 * Checks whether the resulting components all have direction information. This allows to test whether the component
 * is internationalizable.
 *
 * @param received The received result
 * @returns {{pass: boolean, message: (function(): string)}} A jest.extend compatible matcher
 */
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
