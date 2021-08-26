import { URL } from 'url'

export const getPathname = async (): Promise<string> => new URL(await browser.getUrl()).pathname
