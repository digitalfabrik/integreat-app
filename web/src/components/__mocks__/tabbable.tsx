const lib = jest.requireActual('tabbable')

type NodeType = HTMLElement | Document | null
type Options = {
  displayCheck?: 'none' | 'full' | 'non-zero-area'
}

const tabbable = {
  ...lib,
  tabbable: (node: NodeType, options: Options) => lib.tabbable(node, { ...options, displayCheck: 'none' }),
  focusable: (node: NodeType, options: Options) => lib.focusable(node, { ...options, displayCheck: 'none' }),
  isFocusable: (node: NodeType, options: Options) => lib.isFocusable(node, { ...options, displayCheck: 'none' }),
  isTabbable: (node: NodeType, options: Options) => lib.isTabbable(node, { ...options, displayCheck: 'none' }),
}

module.exports = tabbable
