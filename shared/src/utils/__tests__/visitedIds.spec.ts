import { DateTime } from 'luxon'

import { MAX_DAYS_NEW } from '../../constants/index.ts'
import { addVisitedId, getVisitedIds, removeExpiredVisitedIds } from '../visitedIds.ts'

jest.useFakeTimers({ now: new Date('2023-10-02T05:23:57.443+02:00') })

describe('visitedIds', () => {
  const today = DateTime.now().toISODate()
  const expired = DateTime.now()
    .minus({ days: MAX_DAYS_NEW + 1 })
    .toISODate()
  const recent = DateTime.now()
    .minus({ days: MAX_DAYS_NEW - 1 })
    .toISODate()

  describe('addVisitedId', () => {
    it('should add id with current date to the region', () => {
      expect(addVisitedId({ muenchen: { 1: today } }, 'augsburg', '2')).toEqual({
        muenchen: { 1: today },
        augsburg: { 2: today },
      })
    })

    it('should update the date of an already visited id', () => {
      expect(addVisitedId({ augsburg: { 1: recent } }, 'augsburg', '1')).toEqual({ augsburg: { 1: today } })
    })

    it('should remove expired ids of all regions', () => {
      expect(addVisitedId({ augsburg: { 1: expired, 2: recent }, muenchen: { 3: expired } }, 'augsburg', '4')).toEqual({
        augsburg: { 2: recent, 4: today },
      })
    })
  })

  describe('removeExpiredVisitedIds', () => {
    it('should remove expired ids and empty regions', () => {
      expect(removeExpiredVisitedIds({ augsburg: { 1: expired, 2: recent }, muenchen: { 3: expired } })).toEqual({
        augsburg: { 2: recent },
      })
    })
  })

  describe('getVisitedIds', () => {
    it('should return visited ids of the region', () => {
      expect(getVisitedIds({ augsburg: { 1: today, 2: recent }, muenchen: { 3: today } }, 'augsburg')).toEqual([
        '1',
        '2',
      ])
      expect(getVisitedIds({ muenchen: { 3: today } }, 'augsburg')).toEqual([])
    })
  })
})
