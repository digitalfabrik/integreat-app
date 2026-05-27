export type JsonLicenses = {
  [name: string]: {
    license: string
    repository?: string
    author?: string
  }
}

export type License = {
  name: string
  version: string | undefined
  license: string
  repository: string | undefined
  author: string | undefined
}

// matches version number e.g. 1.0.2
const versionNumberRegex = /\d+(\.\d+)*/

// matches @versionNumber e.g. @1.0.2
const versionRegex = /(?:@)\d+(\.\d+)*/

export const parseLicenses = (licenseFile: JsonLicenses): License[] =>
  Object.entries(licenseFile).map(([name, { license, repository, author }]) => {
    const version = name.match(versionNumberRegex)?.[0] ?? ''
    const nameWithoutVersion = name.replace(versionRegex, '')
    return { name: nameWithoutVersion, version, repository, license, author }
  })
