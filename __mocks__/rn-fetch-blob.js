const path = require('path')

let mockFiles = Object.create(null)

function deleteAllMockFiles () {
  mockFiles = Object.create(null)
}

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
  console.log(`writeMockFile: ${content}`)

  return Promise.resolve()
}

function readMockFile (file:string, encoding:string) : Promise {
  const dir = path.dirname(file)
  const fileName = path.basename(file)

  const content = mockFiles[dir][fileName]

  console.log(`readMockFile: ${content}`)

  return mockFiles[dir][fileName]
}

function existsMock (file:string) : Promise {
  console.log(`existsMock. ${file}`)
  const dir = path.dirname(file)
  const fileName = path.basename(file)

  if (!mockFiles[dir]) {
    return Promise.resolve(false)
  } else if (!mockFiles[dir][fileName]) {
    return Promise.resolve(false)
  }
  return Promise.resolve(true)
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
    reset: deleteAllMockFiles,
    dirs: {
      MainBundleDir: () => {},
      CacheDir: () => {},
      DocumentDir: 'path/to/mocks'
    }
  }
}
