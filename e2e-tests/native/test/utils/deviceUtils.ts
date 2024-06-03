import { Selector } from '../helpers/Selector.js'

export const allowNotifications = async (): Promise<void> => {
  await $(new Selector().ByText('Allow').build()).click()
}
