/**
 * Read cookie value by name
 *
 * @param name cookie name
 * @returns cookie value
 */
export function cookieRead(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  return parts && parts.length === 2 ? (parts.pop()?.split(';').shift() ?? null) : null
}

/**
 * Write cookie value
 *
 * @param name cookie name
 * @param value to set
 * @param expireInSeconds amount of seconds until cookie expires. If not set, cookie will expire when browser is closed.
 */
export function cookieWrite(name: string, value: string, expireInSeconds?: number): void {
  let expires = ''
  const secure = window.location.protocol === 'https:' ? '; secure' : ''

  if (expireInSeconds) {
    const date = new Date()

    date.setTime(date.getTime() + expireInSeconds * 1000)
    expires = `; expires=${date.toUTCString()}`
  }

  document.cookie = `${name}=${value}${expires}; path=/${secure}`
}
