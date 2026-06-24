import defaultConfig from './metro.config.js'

export default {
  ...defaultConfig,
  // CircleCI: The issue with this on Dockerized services such as CircleCI is
  // that the container thinks it has access to all of the hosts cores,
  // although it is being limited down to 4 by another process.
  // https://github.com/facebook/create-react-app/issues/4870
  maxWorkers: process.env.TOTAL_CPUS || 1,
  cacheStores: [],
}
