export default class StaticServer {
  constructor({
    fileDir,
    port,
    localOnly,
    keepAlive,
  }: {
    fileDir: string
    port: number
    localOnly?: boolean
    keepAlive?: boolean
  }) {
    this.fileDir = fileDir
    this.port = port
    this.localOnly = localOnly
    this.keepAlive = keepAlive
  }

  start(): Promise<string> {
    return Promise.resolve(`http://localhost:${this.port}`)
  }

  stop(): Promise<boolean> {
    return Promise.resolve(true)
  }
}
