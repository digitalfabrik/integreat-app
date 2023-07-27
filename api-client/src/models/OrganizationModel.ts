class OrganizationModel {
  _name: string
  _url: string
  _logo: string

  constructor({ name, url, logo }: { name: string; url: string; logo: string }) {
    this._name = name
    this._url = url
    this._logo = logo
  }

  get name(): string {
    return this._name
  }

  get url(): string {
    // TODO IGAPP-1356: Remove fallback
    // Using empty strings as url crashes the app
    return this._url ? this._url : 'https://example.com'
  }

  get logo(): string {
    return this._logo
  }

  isEqual(other: OrganizationModel | null): boolean {
    return !!other && this.name === other.name && this.url === other.url && this.logo === other.logo
  }
}

export default OrganizationModel
