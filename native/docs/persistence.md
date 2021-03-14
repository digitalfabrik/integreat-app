# Persistence

The structure of the data stored on the device is:

```
    ├── cities-meta.json
    ├── cities.json
    ├── content
    │   └── augsburg
    │       ├── languages.json
    │       └── en
    │           ├── categories.json
    │           └── events.json
    └── resource-cache
        └── augsburg
            ├── files
            │   └── test.jpg
            └── files.json
```

In general, only files and metadata of maximal three instances are kept (this may differ if peeking).

The `cities-meta.json` contains information about the last content update as well as the last usage of the city:

```json
{
  "regensburg": {
    "languages": {
      "de": {
        "last_update": "2019-08-12T00:03:19.457Z"
      }
    },
    "last_usage": "2019-008-13T00:03:19.457Z"
  }
}
```

The `cities.json` contains information about all cities:

```json
[
  {
    "name": "Stadt Regensburg",
    "live": true,
    "code": "regensburg",
    "prefix": "Stadt",
    "extras_enabled": true,
    "events_enabled": true,
    "sorting_name": "Regensburg"
  }
]
```

The `content` is responsible to store the JSON data from the API.
The `resource-cache` contains all the resources. Resources are files which are either referenced in the HTML content or used as thumbnails of pages.

_Note: Temporary files, like files which are currently downloaded, are also stored in the cache directory. This is platform specific but exists on Android and iOS._

The format of the files is:

**files.json:**

```json
{
  "en": {
    "/ahaus/en/everyday-life-and-free-time/donate-stock/": {
      "https://cms.integreat-app.de/altmuehlfranken/wp-content/uploads/sites/163/2017/11/calendar159-150x150.png": {
        "file_path": "/data/user/0/com.integreat/cache/city/hash(path)/hash(url)extension(url)",
        "last_update": "2011-02-04T00:00:00.000Z",
        "hash": "2f97435138745"
      }
    }
  }
}
```

If an URL does not have an extension then `extension(url)` is an empty string. `hash(url)` returns a md5 sum of the URL. Note that the URL should be valid for both functions.

**categories.json:**

```json
[
  {
    "path": "/ahaus/en/everyday-life-and-free-time/donate-stock/",
    "title": "Donate stock",
    "content": "<h1>This is a sample category</h1>",
    "last_update": "2011-02-04T00:00:00.000Z",
    "thumbnail": "https://cms.integreat-app.de/ahaus/wp-content/uploads/sites/20/2016/05/truck69b-150x150.png",
    "available_languages": {
      "de": "/ahaus/de/alltag-und-freizeit/spendenlager/"
    },
    "parent_path": "/ahaus/en/everyday-life-and-free-time/",
    "children": ["/ahaus/de/alltag-und-freizeit/spendenlager/"],
    "order": 100,
    "hash": "1ebd072de279a714f831526b1861d4ec"
  }
]
```

**events.json:**

```json
[
  {
    "path": "/augsburg/en/events/event0",
    "title": "first Event",
    "content": "<h1>This is a sample event</h1>",
    "last_update": "2019-10-01T04:07:35.659Z",
    "thumbnail": "http://thumbnails/event_0.png",
    "available_languages": {
      "de": "/augsburg/de/events/event0",
      "ar": "/augsburg/ar/events/event0"
    },
    "hash": "93b885adfe0da089cdf634904fd59f71",
    "excerpt": "excerpt",
    "date": {
      "start_date": "2020-03-01T00:00:00.000Z",
      "end_date": "2020-03-01T05:07:35.659Z",
      "all_day": false
    },
    "location": {
      "address": "address",
      "town": "town",
      "postcode": "postcode"
    }
  }
]
```
