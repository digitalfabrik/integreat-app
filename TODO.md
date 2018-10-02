# Required
- [x] Download resources
- [x] Use them in WebView and Image components 
- [x] Fetch and store all languages of a city
- [x] Open PDFs in custom reader on Android
- [x] Open links in WebView externally
- [x] Allow dynamic changing of language ~~(rebuild navigation stack)~~
- [ ] Incrementally update fetched cities (use API v3 and hashes)
- [ ] Improve performance of resource downloading


# Design
- [ ] Dynamically change background of thumbnail SVGs "dynamic_thumbnail"

# Nice to have
- [ ] Disallow [remote loading](https://www.html5rocks.com/en/tutorials/security/content-security-policy/
) of images in WebView
- [ ] Deep Linking
- [ ] Share button (fb/whatsapp)
- [ ] Version [persisted data](https://github.com/rt2zz/redux-persist/blob/master/docs/migrations.md) and test it
- [ ] Dynamically support LTR/RTL (should stay like system language)
- [ ] Display error messages in state
- [ ] Visible debug messages in WebView
- [ ] Support Custom Tabs on android
- [ ] Matamo Analytics: https://reactnavigation.org/docs/en/screen-tracking.html
- [ ] ~~Grant permissions during runtime [how to](https://facebook.github.io/react-native/docs/permissionsandroid)~~
- [ ] App Intro: https://github.com/FuYaoDe/react-native-app-intro
- [ ] FastImage https://github.com/DylanVann/react-native-fast-image
- [ ] After Effects https://github.com/react-community/lottie-react-native
- [ ] Show nearest city (by gps)
- [ ] Use https://cocoapods.org/

# Resources

- react-native-maps osmmaps: https://github.com/react-community/react-native-maps/pull/2348

- Paid Vector tiles download: https://openmaptiles.com/downloads/

- Reverse MapBox: https://gis.stackexchange.com/questions/188141/mapbox-sdk-is-it-free-if-you-host-your-own-vector-tiles https://gis.stackexchange.com/questions/125037/self-hosting-mapbox-vector-tiles
- MapBox Style Spec: https://www.mapbox.com/mapbox-gl-js/style-spec/

- OSM Basics: https://switch2osm.org/the-basics/
- MapBox Style Editor: https://maputnik.github.io/
- Vector Tile Generator from OSM PBF: https://github.com/openmaptiles/openmaptiles
- Openmaptiles Server: https://openmaptiles.com/server/#install
- Wikimedia server: https://github.com/kartotherian/kartotherian
- OSM/PBF data: https://download.geofabrik.de/europe/germany.html
- Telemetrie: https://github.com/mapbox/mapbox-gl-native/blob/7227b4a7ec078d5eced98473c5a7181e5564b471/platform/android/MapboxGLAndroidSDK/src/main/java/com/mapbox/mapboxsdk/module/telemetry/TelemetryImpl.java
