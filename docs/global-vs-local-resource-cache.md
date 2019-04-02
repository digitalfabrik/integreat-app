# Global vs local resource-cache

### global
###### Pro
* No changes to api-client

###### Con
* Mapping to single CategoryModel is difficult


### local
###### Pro
* Resource Cache is where it belongs to

###### Con
* Native side needs changes in order to to it in one call
* CategoryModel becomes mutable e.g. lastUpdated, paths
