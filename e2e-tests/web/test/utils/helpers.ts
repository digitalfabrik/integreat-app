import { URL } from 'url'

export const getUrl = async (): Promise<string> => new URL(await browser.getUrl()).pathname
