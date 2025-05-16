declare module '@dr.pogodin/react-native-static-server' {
  type Options = {
    localOnly?: boolean
    keepAlive?: boolean
    port: number
    fileDir: string
  }
  export default class StaticServer {
    constructor(opts?: Options)

    port: number
    fileDir: string
    localOnly: boolean
    keepAlive: boolean
    started: boolean
    _origin?: string

    start: () => Promise<string>
    stop: () => Promise<void>
    isRunning: () => Promise<boolean>
    kill: () => void
  }
}
