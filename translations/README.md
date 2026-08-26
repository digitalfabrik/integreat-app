# Translations for the Integreat frontend

## Content

- [Supported Languages](#supported-languages)
- [Adding new languages](#adding-new-languages)
- [Export and import workflow](#export-and-import-workflow)
- [Conversion between JSON, CSV and ODS](#conversion-between-json-csv-and-ods)
- [Used file formats](#used-file-formats)
- [Sync index files](#sync-index-files)

## Supported Languages

All supported languages and language tags can be viewed [here](src/config.ts) or in the [wiki](https://wiki.tuerantuer.org/integreat-languages).

## Adding New Languages

You need to follow several steps to add new languages:

- Pick the correct tag for your language: https://iso639-3.sil.org/code_tables/639/data
  - Usually the two-letter [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) language tag should be used.
  - Exceptions: If the ISO 639-1 language tag corresponds to the macro language, or you want to prevent ambiguities/misconceptions,
    the three-letter [ISO 639-3](https://en.wikipedia.org/wiki/ISO_639-3) language tag may be the better choice.
- Add your language tag to the [config](src/config.ts) with its script direction (and possible additional fonts).
- Add your language to the [polyfill list](../native/src/utils/importDisplayNamesPackage.ts).
- Test the new language on both native and web.
- Add the new language to the [wiki](https://wiki.tuerantuer.org/integreat-languages).
- Translate our [translations](src/translations) in your new language, see [export and import workflow](#export-and-import-workflow).
- [Optional] Translate the whitelabel [override translations](src/override-translations), see [export and import workflow](#export-and-import-workflow).
- Sync the index files with `yarn workspace translations sync-indexes` (see [sync index files](#sync-index-files)).

If you need a new font for your language, the following steps are required:

- `web`: Add the new font as `.eot`, `.svg`, `.ttf`, `woff` and `woff2` along with a `.css` stylesheet and a license [here](../web/www/fonts).
- `iOS` Add the new font as `.ttf` [here](../native/ios/Integreat/fonts) and register the new font in XCode.
- `android`: Add the new font as `.ttf` [here](../native/android/app/src/main/assets/fonts).

## Export and import workflow

### Submitting for translation

Translations should be done by professional translators.
We usually ask for translations through our service team.
If there are enough untranslated strings, they can be submitted to professionals for translations as follows:

- Create an issue in our issue tracker.
- Create a new branch for the translations.
- Export the translations and overrides you want:
  - `yarn export`
  - `yarn export:malte`
  - `yarn export:aschaffenburg`
  - `yarn export:obdach`
- Now you can edit the ODS files (e.g. send them to an external translation service). Exporting plain CSVs is currently not supported.

Note: If the translators only work with English source translations, simply change `source_language` in [config.ts](src/config.ts) to `en`.
Make sure to revert this after exporting.

### Receiving finished translations

- Place the edited ODS files in the directories which were generated in the [export step](#submitting-for-translation).
- Import the translations and overrides you want:
  - `yarn import`
  - `yarn import:malte`
  - `yarn import:aschaffenburg`
  - `yarn import:obdach`
- Review the changes carefully.

**Warning:** Make sure to check the received translations on mistakes. For example make sure that our placeholders are not translated.
The following regex can be used to find invalid placeholders (make sure to enable case-sensitive and regex search):

```regexp
\{\{(?!appName|date|exampleRegion|distance|count|organization|domain|source|message|numberOfCharacters|filter|version|number|region)[^}]*}}
```

## Conversion between JSON, CSV and ODS

External translators generally need csv or ods files.
For conversion between json and csv the [manage tool](src/manage.ts) can be used.
For conversion between csv and ods the [csv-to-ods](tools/csv-to-ods) and [ods-to-csv](tools/ods-to-csv) can be used.

**In order to convert json to ods and vice versa, the intermediate step of converting to csv has to be made.**

### JSON to CSV

Export a directory of per-language JSON files to a directory of per-language CSV files:
`yarn manage export <json directory> <csv directory>`

Example: `yarn manage export ./src/translations translations-csv`

Notes:

- The keys in the CSVs are sorted
- Only languages listed in [config.ts](src/config.ts) are exported

### CSV to JSON

Import a directory of per-language CSV files into a directory of per-language JSON files:
`yarn manage import <csv directory> <json directory>`

Example: `yarn manage import translations-csv ./src/translations`

Notes:

- Every CSV must carry the same `source_language` column; a mismatch aborts the import
- Namespaces inside each per-language JSON are sorted
- Languages present in the CSVs but missing from [config.ts](src/config.ts) abort the import
- Languages present in [config.ts](src/config.ts) but missing from the CSVs are logged as warnings

### CSV to ODS

Convert all csv in the specified directory to ods: `./tools/csv-to-ods <csv_directory> <ods_directory>`

Example: `./tools/csv-to-ods translations-csv translation-ods`

### ODS to CSV

Convert all ods in the specified directory to csv: `./tools/ods-to-csv <ods_directory> <csv_directory>`

Example: `./tools/ods-to-csv translations-ods translation-csv`

## Used file formats

### JSON

- Used for internal representation of our translations
- One file per language, e.g. `src/translations/de.json`
- Structure inside each file: `namespace` > `(nested) key` > `translation`
- UTF-8 encoded

### CSV

- Comma Separated Values
- Each CSV contains exactly one language
- Structured via dot-delimited keys. Keys for translations are created using module names and nested keys.
- UTF-8 encoded

### ODS

- Used for distribution of CSVs as the CSV format does not define the exact format.

## Sync index files

`loadTranslations` and whitelabel build configs need all per-language JSON files.
For this purpose, we use autogenerated index.ts barrel files: `src/translations/index.ts` and `src/override-translations/<build-config-name>/index.ts`.

Sync the index files by running:

```bash
yarn workspace translations sync-index
```
