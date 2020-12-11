# Translations for the Integreat frontend

## Content
* [Submitting for translation](#submitting-for-translation)
* [Conversion between JSON, CSV and ODS](#conversion-between-json-csv-and-ods)
* [Used file formats](#used-file-formats)

## Submitting for translation

Translations should be done by professional translators. If there are enough untranslated strings,
they can be submitted to professionals for translations as follows:

* Create an issue in our issue tracker.
* Create a new branch for the issue.
* Create the directory `./external-jobs/<identifier>/sent`.
    * `<identifier>` should be `<year>-<month>-<optional_key>`.
    * Examples: `2020-01` and `2020-06-malte`
* [Convert json files to csv and/or ods](#conversion-between-json-csv-and-ods).
    * This has to be done for every file that needs translation.
    * Current translation files are [translations.json](./translations.json) and [malte override translations](./override-translations/malte.json).
* Send the `sent` folder and the [translation rules](./RULES.md) to the external translation service.

### Receiving finished translations

* Copy the received files to `./external-jobs/<identifier>/received`
* [Convert received csv or ods files to json](#conversion-between-json-csv-and-ods).
    * This has to be done for every file that needs translation.
    * Current translation files are [translations.json](./translations.json) and [malte override translations](./override-translations/malte.json).
* Open a PR with the changes. Except for proofreading jobs, no existing values should be changed.

## Conversion between JSON, CSV and ODS

External translators generally need csv or ods files.
For conversion between json and csv the [manage tool](tools/manage) can be used.
For conversion between csv and ods the [csv-to-ods](tools/csv-to-ods) and [ods-to-csv](tools/ods-to-csv) can be used.

**In order to convert json to ods and vice versa, the intermediate step of converting to csv has to be made.**

### JSON to CSV

Convert the specified json file to multiple csv (one per language) in the given directory:
`./tools/manage convert <json file> <csv directory> csv`

Example: `./tools/manage convert ./translations.json ./external-jobs/2020-06-malte/sent csv`

Notes:
* The module keys in the CSVs are sorted

### CSV to JSON

Convert the csv files in the specified directory to a json file:
`./tools/manage convert <csv directory> <json file> json`

Example: `./tools/manage convert ./external-jobs/2020-06-malte/received ./translations.json json`
 
Notes:
* The module and language keys in the JSON are sorted
* The source language is always the first language

### CSV to ODS

Convert all csv in the specified directory to ods: `./tools/csv-to-ods <directory>`

Example: `./tools/csv-to-ods ../external-jobs/2020-06-malte`

### ODS to CSV

Convert all ods in the specified directory to csv: `./tools/ods-to-csv <directory>` 

Example: `./tools/ods-to-csv ../external-jobs/2020-06-malte`
 
## Used file formats

### JSON

* Used for internal representation of our translations
* Structure: `namespace` > `language` > `(nested) key` > `translation`
* UTF-8 encoded

### CSV

* Comma Separated Values 
* Each CSV contains exactly one language
* Structured via dot-delimited keys. Keys for translations are created using module names and nested keys. 
* UTF-8 encoded

### ODS

* Used for distribution of CSVs as the CSV format does not define the exact format.
* For an example see `./external-jobs/2020-06-malteser`
