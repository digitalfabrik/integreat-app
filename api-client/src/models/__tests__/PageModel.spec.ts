import { DateTime } from 'luxon'

import PageModel from '../PageModel'

describe('PageModel', () => {
  const page = new PageModel({
    path: '/augsburg/fa/erste-schritte/%D9%86%D9%82%D8%B4%D9%87-%D8%B4%D9%87%D8%B1/',
    title: 'Welcome',
    content: '',
    lastUpdate: DateTime.fromISO('2016-01-07 10:36:24'),
  })

  it('should normalize path', () => {
    expect(page.path).toBe('/augsburg/fa/erste-schritte/نقشه-شهر')
  })
})
