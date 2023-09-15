export type JsonLicenses = {
  [name: string]: {
    license: string
    url?: string
  }
}

export type License = {
  name: string
  version: string | undefined
  license: string
  licenseUrl: string | undefined
}

// matches @versionNumber e.g. @1.0.2
const versionRegex = /(?:@[a-z]+:)(\d+(\.\d+)*)/m

export const parseLicenses = (licenseFile: JsonLicenses): License[] =>
  Object.entries(licenseFile)
    .filter(([name]) => !name.includes('workspace:') && !name.includes('portal:'))
    .map(([name, { license, url }]) => {
      const matchedVersion = name.match(versionRegex) ?? ''
      const version = matchedVersion[1]

      const nameWithoutVersion = name.replace(matchedVersion[0], '')
      return { name: nameWithoutVersion, version, licenseUrl: url, license }
    })
