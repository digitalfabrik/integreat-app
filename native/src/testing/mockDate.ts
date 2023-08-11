import { DateTime } from 'luxon'

export default (
  mockDate: DateTime
): {
  restoreDate: () => void
} => {
  const spy = jest.spyOn(global.Date, 'now').mockReturnValue(mockDate.valueOf())
  return {
    restoreDate: () => {
      spy.mockRestore()
    },
  }
}
