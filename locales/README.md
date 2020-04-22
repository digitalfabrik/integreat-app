# Locales for the Integreat frontend

## Usage

This repository should be included as a [git subtree](https://raw.githubusercontent.com/git/git/master/contrib/subtree/git-subtree.txt). 

For easier management of the subtrees, it is possible to add the `integreat-locales` repository as a remote:

```bash
git remote add locales git@github.com:Integreat/integreat-locales.git
```

Initially, if the locales directory does not exist, you have to do:

```bash
git subtree add --prefix locales locales master --squash
```

The `--squash` command creates only a single commit for all of the changes. 

### Pulling changes

Pulling is required if you want to fetch commits from `integreat-locales`. This can happen because the project is shared between multiple people and branches. For example if somebody makes a change in the `integreat-locales` repository, then you can pull these changes in the _native app_ using:

```bash
git subtree pull --prefix locales locales master --squash
```

Note that we are using the `--squash` command which will create a merge commit:

```txt
*   b7ecd2f Merge commit '61d6a7d61de73a29e15ed08acad0a8eb3364c042' as 'locales'
|\
| * 61d6a7d Squashed 'locales/' content from commit 64908a1
* d518e01 Initial commit
```

### Pushing changes

When pushing changes you are required to do the changes directly in the `integreat-locales` repository. After that you can pull the changes.

You should create a separate branch in `integreat-locales` for your locale changes. When pulling the changes you can do:
```bash
git subtree pull --prefix locales locales test-subtrees --squash -m "Merging squashed locales for branch $(git rev-parse --abbrev-ref HEAD)"
```

This will create a merge commit with the changes from the `NATIVE-X` branch:
```
*   dc053771 (HEAD -> NATIVE-497-subtree) Merging squashed locales for branch NATIVE-497-subtree
|\  
| * 3d386e7c Squashed 'locales/' changes from b0db264d..2f2d7443
| * 850eada7 Squashed 'locales/' content from commit b0db264d
* | 7053596b NATIVE-Y: Some change
* | 7053596b NATIVE-Y: Some other change
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
