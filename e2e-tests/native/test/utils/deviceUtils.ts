import { Selector } from '../helpers/Selector.js'

export const allowNotifications = async () => {
  await $(new Selector().ByText('Allow').build()).click()
}
