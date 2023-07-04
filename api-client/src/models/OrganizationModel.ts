class OrganizationModel {
  _name: string
  _url: string | null
  _logo: string | null

  constructor({ name, url, logo }: { name: string; url: string | null; logo: string | null }) {
    this._name = name
    this._url = url
    this._logo = logo
  }

  get name(): string {
    return this._name
  }

  get url(): string {
    // TODO: Remove fallback
    return this._url ?? 'https://example.com/my-custom-url'
  }

  get logo(): string {
    // TODO: Remove fallback
    // return this._logo ?? 'https://webnext.integreat.app/app-logo.png'
    return 'https://admin.integreat-app.de/media/regions/214/2023/02/TaT_DF_LOGO.png'
  }
}

export default OrganizationModel
