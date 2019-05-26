# Persistence

The structure of the data stored on the device is:

```
    ├── cities.json
    ├── content
    │   └── augsburg
    │       └── en
    │           ├── categories.json
    │           └── events.json
    └── resource-cache
        └── augsburg
            ├── files
            │   └── test.jpg
            └── files.json
```

The `cities.json` could contain information about all cities. Usually they are not persisted:
```
{
  "regensburg": {
    "name": "Stadt Regensburg",
    "languages": {
      "de": {
        "name": "Deutsch",
        "dir": "ltr"
      }
    },
    "offline_available": true,
    "live": true,
    "sorting_name": "Regensburg",
    "events": true,
    "push_notifications": true,
    "extras": true
  }
}
```

The ''content'' is responsible to store the JSON data from the API.
The ''resource-cache'' contains all the resources. Resources are files which are either referenced in the HTML content or used as thumbnails of pages.

The files are stored in ''resource-cache/${city}/files/'' and the corresponding metadata gets stored in ''files.json''.

The format of the files is:

**files.json:**
```json
{
  "en": {
    "/ahaus/en/everyday-life-and-free-time/donate-stock/": {
      "https://cms.integreat-app.de/altmuehlfranken/wp-content/uploads/sites/163/2017/11/calendar159-150x150.png": {
        "path": "/data/user/0/com.integreat/cache/city/hash(path)/hash(url).extension(url)",
        "last_update": "2017-01-22 19:51:10",
        "hash": "2f97435138745"
      }
    }
  }
}
```

**categories.json:**
```json
[
  {
    "path": "/ahaus/en/everyday-life-and-free-time/donate-stock/",
    "title": "Donate stock",
    "content": "",
    "last_update": "2017-01-22 19:51:10",
    "thumbnail": "https://cms.integreat-app.de/ahaus/wp-content/uploads/sites/20/2016/05/truck69b-150x150.png",
    "available_languages": {
      "de": "/ahaus/de/alltag-und-freizeit/spendenlager/"
    },
    "parent_path": "/ahaus/en/everyday-life-and-free-time/",
    "children": [
      "/ahaus/de/alltag-und-freizeit/spendenlager/"
    ],
    "order": 100,
    "hash": "1ebd072de279a714f831526b1861d4ec"
  }
]
```

**events.json:**
```json

```

**
