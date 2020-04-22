# Locales for the Integreat frontend

## Usage

This repository should be included as a [git subtree](https://raw.githubusercontent.com/git/git/master/contrib/subtree/git-subtree.txt). Initially you have to do:

```bash
git subtree add --prefix locales git@github.com:Integreat/integreat-locales.git  master --squash
```


## Origin

This repository is the result of a merge of the locales between the webapp project and the react-native project. The base for the locales is the file `src/locales` from the integreat-react-native project. It was copied on on 04-09-2018 the from the integreat-webapp project.
All changes after 04-09-2018 have been reapplied to the locales.json such that no locale changes are missing. The patches can be found in `origin`.

## manage.js

### Converting to CSV

Example: `./manage convert locales.json csv csv`

Notes:
* The module keys in the CSVs are sorted

### Converting to JSON

Example: `./manage convert csv locales.json json`
 
Notes:
* The module and language keys in the JSON are sorted
* The source language is always the first language
