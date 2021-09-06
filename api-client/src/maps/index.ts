interface MapConfigProps {
  styleJSON: string
  accessToken: string
}

export interface MapViewViewport {
  width: number
  height: number
  latitude: number
  longitude: number
  zoom: number
}

export const mapConfig: MapConfigProps = {
  styleJSON: 'https://integreat.github.io/integreat-osm-liberty/style.json',
  accessToken: 'test'
}

export const defaultViewportConfig: MapViewViewport = {
  width: 400,
  height: 400,
  latitude: 48.366512,
  longitude: 10.894446,
  zoom: 8
}

export const detailZoom = 15
export const mapQueryId = 'id'
