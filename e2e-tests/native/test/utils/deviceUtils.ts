import { Selector } from '../helpers/Selector.js'

export const allowNotifications = async (): Promise<void> => {
  const allow = await $(new Selector().ByText('Allow').build())
  if (await allow.isExisting()) {
    allow.click()
  }
}
