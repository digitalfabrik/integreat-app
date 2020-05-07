# Locales for the Integreat frontend

## Usage

This repository should be included as a [git subtree](https://raw.githubusercontent.com/git/git/master/contrib/subtree/git-subtree.txt). 

For easier management of the subtrees, you should add the `integreat-locales` repository as a remote
(otherwise the whole repo url has to be used for each command):

```bash
git remote add locales git@github.com:Integreat/integreat-locales.git
```

Initially, if the locales directory **does not exist**, you have to do:

```bash
git subtree add --prefix locales locales master --squash
```

The `--squash` command creates only a single commit for all the changes. After adding the subtree the log of your repository will look like this:

```txt
*   b7ecd2f Merge commit '61d6a7d61de73a29e15ed08acad0a8eb3364c042' as 'locales'
|\
| * 61d6a7d Squashed 'locales/' content from commit 64908a1
* d518e01 Initial commit
```

### Pulling Changes

**No action should cause a merge conflict! If there is a conflict then you are using subtrees wrong!**

Pulling is required if you want to fetch commits from `integreat-locales`.
This can happen because the project is shared between multiple people and branches as well as to pull your own changes made in the locales repo.
To pull from `<branch>` of the locales, execute the following command (or the alias described in [Tips & Tricks](#tips-&-tricks):

```bash
git subtree pull --prefix locales locales <branch> --squash -m "Merging squashed locales for branch $(git rev-parse --abbrev-ref HEAD)"
```

Note that we are using the `--squash` command which will create a merge commit:

```
*   dc053771 (HEAD -> NATIVE-497-subtree) Merging squashed locales for branch NATIVE-497-subtree
|\  
| * 3d386e7c Squashed 'locales/' changes from b0db264d..2f2d7443
| * 850eada7 Squashed 'locales/' content from commit b0db264d
* | 7053596b NATIVE-Y: Some change
* | 7053596b NATIVE-Y: Some other change
```

### Pushing Changes

**No action should cause a merge conflict! If there is a conflict then you are using subtrees wrong!**

Modifications on the locales files should **only be made directly in the `integreat-locales` repository**.
Just create a branch and a PR in the `integreat-locales` repo and pull the corresponding branch using the command mentioned in [Pulling Changes](#pulling-changes).

**Note that you should not rebase the new branch after you pulled it into another repository.**

After merging `<branch>` into `master` it is possible for anyone to pull again from `master` like described in [Pulling Changes](#pushing-changes). This step is optional for you right now as it will be pulled by the next person which creates a PR.

### Tips & Tricks

As the pull command is quite long you can define an alias:
```bash
git config alias.pull-locales '!f() { git subtree pull --prefix locales locales $1 --squash -m "Merging squashed locales for branch $(git rev-parse --abbrev-ref HEAD)"; }; f'
```

Then you can pull using:

```bash
git pull-locales <branch>
```

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

## Origin of the locales

This repository is the result of a merge of the locales between the webapp project and the react-native project. The base for the locales is the file `src/locales` from the integreat-react-native project. It was copied on on 04-09-2018 the from the integreat-webapp project.
All changes after 04-09-2018 have been reapplied to the locales.json such that no locale changes are missing. The patches can be found in `origin`.
