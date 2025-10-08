export default {
  rootDir: 'src/',
  displayName: 'translations',
  automock: false,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  maxWorkers: '50%',
  transform: {
    '^.+\\.(j|t)sx?$': ['ts-jest', {}],
  },
}
