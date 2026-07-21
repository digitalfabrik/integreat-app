import { URL } from 'node:url'

export const getPathname = async (): Promise<string> => new URL(await browser.getUrl()).pathname
