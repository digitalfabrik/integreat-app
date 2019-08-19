const existsMock = jest.fn()
existsMock.mockReturnValueOnce({ then: jest.fn() })

export default {
  DocumentDir: () => {},
  ImageCache: {
    get: {
      clear: () => {}
    }
  },
  fs: {
    exists: existsMock,
    dirs: {
      MainBundleDir: () => {},
      CacheDir: () => {},
      DocumentDir: () => {}
    }
  }
}
