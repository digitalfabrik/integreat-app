import { formatFrequency } from '../ExportEventButton'

describe('formatFrequency', () => {
  it('should correctly return all frequencies that can be selected in the CMS', () => {
    expect(formatFrequency(3)).toBe('daily')
    expect(formatFrequency(2)).toBe('weekly')
    expect(formatFrequency(1)).toBe('monthly')
    expect(formatFrequency(0)).toBe('yearly')
  })
})
