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
    return this._url
  }

  get logo(): string {
    return this._logo
  }

  isEqual(other: OrganizationModel | null): boolean {
    return !!other && this.name === other.name && this.url === other.url && this.logo === other.logo
  }
}

export default OrganizationModel
