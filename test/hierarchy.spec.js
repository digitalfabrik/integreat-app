import { expect } from 'chai'
import Hierarchy from 'location/hierarchy'
import { PageModel } from 'endpoints/page'

describe('hierarchy', () => {
  let hierarchy = new Hierarchy('/123/456')

  let child2 = new PageModel(456, 'Another Simple Page', 0)
  let child1 = new PageModel(123, 'Simple Page', 0, 'Content', null, {456: child2})
  let root = new PageModel(0, 'Augsburg', 0, 'Content', null, {123: child1})

  hierarchy.build(root)

  it('building', () => {

    let pages = hierarchy.pages

    expect(pages[0]).to.deep.equal(root, 'The root page should be the first page')
    expect(pages[1]).to.deep.equal(child1, 'The child1 page does not equal')
    expect(pages[2]).to.deep.equal(child2, 'The child2 page does not equal')
  })

  it('path mappings', () => {
    let paths = []

    hierarchy.map((page, path) => {
      paths.push(path)
    })

    expect(paths).to.deep.equal(['', '/123', '/123/456'])
  })
})
