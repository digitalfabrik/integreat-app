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

In general, only files and metadata of maximal three instances are kept.

The `cities-meta.json` contains information about the last content update as well as the last usage of the city:

```json
{
  "regensburg": {
    "languages": {
      "de": {
        "lastUpdate": Luxon.DateTime
      }
    },
    "lastUsage": Luxon.DateTime
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
    "languages": [
      {
        "code": "de",
        "name": "Deutsch"
      }
    ],
    "prefix": "Stadt",
    "eventsEnabled": true,
    "chatEnabled": false,
    "chatPrivacyPolicyUrl": "https://privacy.org",
    "poisEnabled": true,
    "pushNotificationsEnabled": true,
    "tunewsEnabled": false,
    "sortingName": "Regensburg",
    "longitude": 50,
    "latitude": 40,
    "aliases": {
      "Regnesburg": {
        "longitude": 50,
        "latitude": 40
      }
    },
    "boundingBox": [40, 60, 30, 50]
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
        "filePath": "/data/user/0/com.integreat/cache/city/hash(path)/hash(url)extension(url)",
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
    "root": false,
    "path": "/ahaus/en/everyday-life-and-free-time/donate-stock/",
    "title": "Donate stock",
    "content": "<h1>This is a sample category</h1>",
    "lastUpdate": Luxon.DateTime,
    "thumbnail": "https://cms.integreat-app.de/ahaus/wp-content/uploads/sites/20/2016/05/truck69b-150x150.png",
    "availableLanguages": {
      "de": "/ahaus/de/alltag-und-freizeit/spendenlager/"
    },
    "parentPath": "/ahaus/en/everyday-life-and-free-time/",
    "children": ["/ahaus/de/alltag-und-freizeit/spendenlager/"],
    "order": 100,
    "organization": {
      "name": "Digitalfabrik",
      "logo": "https://some.logo",
      "url": "https://digitalfabrik.de"
    },
    "embeddedOffers": [{
      "title": "Sprungbrett",
      "alias": "",
      "thumbnail": "https://another.logo",
      "path": "/path/to/a/list/of/offers"
    }]
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
    "lastUpdate": Luxon.DateTime,
    "thumbnail": "http://thumbnails/event_0.png",
    "availableLanguages": {
      "de": "/augsburg/de/events/event0",
      "ar": "/augsburg/ar/events/event0"
    },
    "excerpt": "excerpt",
    "date": {
      "start": Luxon.DateTime,
      "end": Luxon.DateTime,
      "allDay": false,
      "recurrenceRule": "DTSTART:20240116T090000\nRRULE:FREQ=WEEKLY;BYDAY=TU",
      "offset": 60,
      "onlyWeekdays": false
    },
    "location": {
      "id": 1,
      "address": "address",
      "town": "town",
      "postcode": "postcode",
      "latitude": 40,
      "longitude": 50,
      "country": "Germany",
      "name": "Location"
    },
    "featuredImage": {
      "description": "An image",
      "thumbnail": {
        "url": "https://thumbnail.test",
        "width": 500,
        "height": 300,
      },
      "medium": {
        "url": "https://thumbnail.test",
        "width": 500,
        "height": 300,
      },
      "large": {
        "url": "https://thumbnail.test",
        "width": 500,
        "height": 300,
      },
      "full": {
        "url": "https://thumbnail.test",
        "width": 500,
        "height": 300,
      },
    },
    "poiPath": "/path/to/poi"
  }
]
```
