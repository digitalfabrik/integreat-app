import md5 from 'js-md5'

export default (urlString: string): string => md5.create().update(urlString).hex()
