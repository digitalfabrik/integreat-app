import path from 'path'
type MockFilesType = Record<string, string>
const mockFiles: MockFilesType = {}

function deleteAllMockFiles() {
  for (const path in mockFiles) {
    delete mockFiles[path]
  }
}

function writeMockFile(file: string, content: string, encoding: string): Promise<void> {
  const filePath = path.normalize(file)
  mockFiles[filePath] = content
  return Promise.resolve()
}

function readMockFile(file: string, encoding: string): Promise<string> {
  const filePath = path.normalize(file)
  return Promise.resolve(mockFiles[filePath])
}

function existsMock(file: string): Promise<boolean> {
  const filePath = path.normalize(file)
  const exists = filePath in mockFiles
  const isParentOfExisting = Object.keys(mockFiles).some(filePath => filePath.startsWith(file))
  return Promise.resolve(exists || isParentOfExisting)
}

function lsMock(path: string): Promise<Array<string>> {
  const filesInPath = Object.keys(mockFiles).filter(filePath => filePath.startsWith(path))
  return Promise.resolve(filesInPath)
}

/**
 * Delete a file or an entire folder at path. Note that there will be no error if the file to be deleted does not exist
 * @param file
 * @return {Promise<void>}
 */
function unlink(file: string): Promise<void> {
  const filePath = path.normalize(file)
  Object.keys(mockFiles).forEach(path => {
    const slicedPath = path.slice(0, filePath.length)

    // Delete file if paths are matching or file is an ancestor directory
    if (filePath === path || (filePath === slicedPath && path[filePath.length] === '/')) {
      delete mockFiles[path]
    }
  })
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
    ls: jest.fn<Promise<Array<string>>, [string]>(lsMock),
    exists: jest.fn<Promise<boolean>, [string]>(existsMock),
    writeFile: jest.fn<Promise<void>, [string, string, string]>(writeMockFile),
    readFile: jest.fn<Promise<string>, [string, string]>(readMockFile),
    unlink: jest.fn<Promise<void>, [string]>(unlink),
    _reset: jest.fn<void, []>(deleteAllMockFiles),
    dirs: {
      MainBundleDir: 'path/to/mainBundleDir',
      CacheDir: 'path/to/cacheDir',
      DocumentDir: 'path/to/documentDir'
    }
  }
}
