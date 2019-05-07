// @flow

/**
 * Iterates through a tree until depth is reached. A depth of 0 means only the root is visited.
 * A depth of 1 means the root and the children of it are visited. Please note that for each children of the root
 * nodeAction is called once with the category and null for the children as parameters.
 *
 * @param root The root to start iterating from
 * @param resolveChildren The function which is used to resolve children
 * @param depth The depth
 * @param nodeAction The action to trigger for each node and children
 */
const forEachTreeNode = <T>(
  root: T,
  resolveChildren: T => Array<T>,
  depth: number,
  nodeAction: (T, ?Array<T>) => void
) => {
  if (depth === 0) {
    nodeAction(root, null)
  } else {
    const children = resolveChildren(root)
    nodeAction(root, children)
    children.forEach(child => forEachTreeNode(child, resolveChildren, depth - 1, nodeAction))
  }
}

export default forEachTreeNode
