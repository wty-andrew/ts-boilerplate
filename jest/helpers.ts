// taken from https://github.com/visionmedia/supertest/issues/481
export interface ExtractedCookie {
  value: string
  flags: Record<string, string | boolean | number>
}

const shapeFlags = (flags: string[]) =>
  flags.reduce((shapedFlags, flag) => {
    const [flagName, rawValue] = flag.split('=')
    const value = rawValue ? rawValue.replace(';', '') : true
    return { ...shapedFlags, [flagName]: value }
  }, {})

export const extractCookies = (
  cookies: string[] | undefined
): Record<string, ExtractedCookie> => {
  return cookies === undefined
    ? {}
    : cookies.reduce((shapedCookies, cookieString) => {
        const [rawCookie, ...flags] = cookieString.split('; ')
        const [cookieName, value] = rawCookie.split('=')
        return {
          ...shapedCookies,
          [cookieName]: { value, flags: shapeFlags(flags) },
        }
      }, {})
}
