const path = require('path')

const mockFiles = Object.create(null)

function writeMockFile (file:string, content:string | Array, encoding:string) : Promise {
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

function readMockFile (file:string, encoding:string) : Promise {
  const dir = path.dirname(file)
  const fileName = path.basename(file)

  return mockFiles[dir][fileName]
}

function existsMock (file:string):Promise {
  const dir = path.dirname(file)
  const fileName = path.basename(file)

  return mockFiles[dir][fileName]
}

function readdirSync (pathToDirectory) {
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
    readdirSync: readdirSync,
    exists: existsMock,
    writeFile: writeMockFile,
    readFile: readMockFile,
    dirs: {
      MainBundleDir: () => {},
      CacheDir: () => {},
      DocumentDir: 'path/to/mocks'
    }
  }
}
