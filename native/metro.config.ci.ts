import defaultConfig from './metro.config.ts'

module.exports = {
  ...defaultConfig,
  maxWorkers: process.env.TOTAL_CPUS || 1,

  /* CircleCI: The issue with this on Dockerized services such as CircleCI is
                                          that the container thinks it has access to all of the hosts cores,
                                          although its being limited down to 4 by another process.
                                          https://github.com/facebook/create-react-app/issues/4870 */
  cacheStores: []
}
