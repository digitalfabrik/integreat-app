# Translations for the Integreat frontend

## Content
* [Export and import workflow](#export-and-import-workflow)
* [Conversion between JSON, CSV and ODS](#conversion-between-json-csv-and-ods)
* [Used file formats](#used-file-formats)

## Export and import workflow

### Submitting for translation

Translations should be done by professional translators. If there are enough untranslated strings,
they can be submitted to professionals for translations as follows:

* Create an issue in our issue tracker.
* Create a new branch for the translations.
* Export the translations and overrides you want:
  * `yarn export:ods:translations`
  * `yarn export:ods:override-malte`
  * `yarn export:ods:override-aschaffenburg`
* Now you can edit the ODS files (e.g. send them to an external translation service). Exporting plain CSVs is currently not supported.

### Receiving finished translations

* Place the edited ODS files in the directories which were generated in the [export step](#submitting-for-translation).
* Import the translations and overrides you want:
  * `yarn import:ods:translations`
  * `yarn import:ods:override-malte`
  * `yarn import:ods:override-aschaffenburg`
* Review the changes carefully.

## Conversion between JSON, CSV and ODS

External translators generally need csv or ods files.
For conversion between json and csv the [manage tool](tools/manage.js) can be used.
For conversion between csv and ods the [csv-to-ods](tools/csv-to-ods) and [ods-to-csv](tools/ods-to-csv) can be used.

**In order to convert json to ods and vice versa, the intermediate step of converting to csv has to be made.**

### JSON to CSV

Convert the specified json file to multiple csv (one per language) in the given directory:
`./tools/manage convert <json file> <csv directory> csv`

Example: `./tools/manage convert ./translations.json translations-csv csv`

Notes:
* The module keys in the CSVs are sorted

### CSV to JSON

Convert the csv files in the specified directory to a json file:
`./tools/manage convert <csv directory> <json file> json`

Example: `./tools/manage convert translations-csv ./translations.json json`
 
Notes:
* The module and language keys in the JSON are sorted
* The source language is always the first language

### CSV to ODS

Convert all csv in the specified directory to ods: `./tools/csv-to-ods <csv_directory> <ods_directory>`

Example: `./tools/csv-to-ods translations-csv translation-ods`

### ODS to CSV

Convert all ods in the specified directory to csv: `./tools/ods-to-csv <ods_directory> <csv_directory>` 

Example: `./tools/ods-to-csv translations-ods translation-csv`
 
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

