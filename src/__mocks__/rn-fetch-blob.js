// @flow

const path = require('path')

let mockFiles = {}

function deleteAllMockFiles (): void {
  mockFiles = {}
}

function writeMockFile (file: string, content: string | Array<string>, encoding: string): Promise<void> {
  const dir = path.dirname(file)
  const fileName = path.basename(file)
  if (!mockFiles[dir]) {
    mockFiles[dir] = []
  }
  if (!mockFiles[dir][fileName]) {
    mockFiles[dir].push(fileName)
  }

  mockFiles[dir][fileName] = content

  return Promise.resolve()
}

function readMockFile (file: string, encoding: string): Promise<string> {
  const dir = path.dirname(file)
  const fileName = path.basename(file)

  return mockFiles[dir][fileName]
}

function existsMock (file: string): Promise<boolean> {
  const dir = path.dirname(file)
  const fileName = path.basename(file)

  if (!mockFiles[dir]) {
    return Promise.resolve(false)
  } else if (!mockFiles[dir][fileName]) {
    return Promise.resolve(false)
  }
  return Promise.resolve(true)
}

function readdirSync (pathToDirectory: string): Array<string> {
  return mockFiles[pathToDirectory]
}

export default {
  DocumentDir: () => {},
  ImageCache: {
    get: {
      clear: () => {}
    }
  },
  fs: {
    readdirSync: jest.fn<$ReadOnlyArray<string>, Array<string>>(readdirSync),
    exists: jest.fn<$ReadOnlyArray<string>, Promise<boolean>>(existsMock),
    writeFile: jest.fn<$ReadOnlyArray<*>, Promise<void>>(writeMockFile),
    readFile: jest.fn<$ReadOnlyArray<*>, Promise<string>>(readMockFile),
    reset: jest.fn<$ReadOnlyArray<*>, void>(deleteAllMockFiles),
    dirs: {
      MainBundleDir: 'path/to/mainBundleDir',
      CacheDir: 'path/to/cacheDir',
      DocumentDir: 'path/to/documentDir'
    }
  }
}
