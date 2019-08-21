const existsMock = jest.fn()
existsMock.mockReturnValueOnce({ then: jest.fn() })

let mockFiles = Object.create(null);

function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

function readdirSync(pathToDirectory){
  return mockFiles[pathToDirectory];
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
    __setMockFiles: __setMockFiles(),
    exists: existsMock,
    dirs: {
      MainBundleDir: () => {},
      CacheDir: () => {},
      DocumentDir: () => {}
    }
  }
}
