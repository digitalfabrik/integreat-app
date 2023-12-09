import { DateTime } from 'luxon'

class Cookie {
  static get(name: string): string | null {
    const cookieName = `${encodeURIComponent(name)}=`
    const cookie = document.cookie
    if (!cookie.includes(cookieName)) {
      return null
    }
    return decodeURIComponent(cookie.replace(cookieName, ''))
  }

  static set(
    name: string,
    value: string,
    path: string,
    domain: string,
    expires = DateTime.now().plus({ year: 1 }),
  ): void {
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
      value,
    )}; expires=${expires.toJSDate()}; path=${path}; domain=${domain}; secure;`
  }

  static remove(name: string, path: string, domain: string): void {
    Cookie.set(name, '', path, domain, DateTime.fromMillis(0))
  }
}

export default Cookie
