// @flow

import path from 'path'

type MockFilesType = {
  [path: string]: string
}

const mockFiles: MockFilesType = {}

function deleteAllMockFiles () {
  for (const path in mockFiles) {
    delete mockFiles[path]
  }
}

function writeMockFile (file: string, content: string, encoding: string): Promise<void> {
  const filePath = path.normalize(file)
  mockFiles[filePath] = content
  return Promise.resolve()
}

function readMockFile (file: string, encoding: string): Promise<string> {
  const filePath = path.normalize(file)
  return Promise.resolve(mockFiles[filePath])
}

function existsMock (file: string): Promise<boolean> {
  const filePath = path.normalize(file)
  return Promise.resolve(filePath in mockFiles)
}

function unlink (file: string): Promise<void> {
  const filePath = path.normalize(file)
  if (filePath in mockFiles) {
    delete mockFiles[filePath]
  }

  return Promise.resolve()
}

export default {
  DocumentDir: () => {},
  ImageCache: {
    get: {
      clear: () => {}
    }
  },
  fs: {
    exists: jest.fn<[string], Promise<boolean>>(existsMock),
    writeFile: jest.fn<[string, string, string], Promise<void>>(writeMockFile),
    readFile: jest.fn<[string, string], Promise<string>>(readMockFile),
    unlink: jest.fn<[string], Promise<void>>(unlink),
    _reset: jest.fn<[], void>(deleteAllMockFiles),
    dirs: {
      MainBundleDir: 'path/to/mainBundleDir',
      CacheDir: 'path/to/cacheDir',
      DocumentDir: 'path/to/documentDir'
    }
  }
}
