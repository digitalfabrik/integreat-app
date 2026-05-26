export default {
  rootDir: 'src/',
  displayName: 'translations',
  automock: false,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  maxWorkers: '50%',
  transform: {
    '^.+\\.(j|t)sx?$': ['ts-jest', {}],
  },
}
