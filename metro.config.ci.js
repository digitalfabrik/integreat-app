module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    }),
    assetPlugins: ['react-native-svg-asset-plugin']
  },
  cacheStores: []
}
