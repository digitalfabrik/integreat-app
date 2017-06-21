import { expect } from 'chai'
import Hierarchy from 'location/hierarchy'
import { PageModel } from 'endpoints/page'

describe('hierarchy', () => {

  it('test', () => {
    let hierarchy = new Hierarchy('/123/')

    let child = new PageModel(123, 'Simple Page', 0)
    let rootChildren = {123: child}
    let root = new PageModel(0, 'Augsburg', 0, 'Content', null, rootChildren)

    hierarchy.build(root)
    let pages = hierarchy.pages

    expect(pages[0]).to.deep.equal(root, 'The root page should be the first page')
    expect(pages[1]).to.deep.equal(child, 'The child page does not equal')
  })

})
