import { program } from 'commander'

import { GITKEEP_FILE, UNRELEASED_DIR, RELEASE_NOTES_DIR } from './constants'
import authenticate from './github-authentication'

program
  .option('-d, --debug', 'enable extreme logging')
  .requiredOption(
    '--deliverino-private-key <deliverino-private-key>',
    'private key of the deliverino github app in pem format with base64 encoding'
  )
  .requiredOption('--owner <owner>', 'owner of the current repository, usually "Integreat"')
  .requiredOption('--repo <repo>', 'the current repository, usually "integreat-app"')
  .requiredOption('--branch <branch>', 'the current branch')

type Options = {
  newVersionName: string
  deliverinoPrivateKey: string
  owner: string
  repo: string
  branch: string
}

const moveReleaseNotes = async ({ newVersionName, deliverinoPrivateKey, owner, repo, branch }: Options) => {
  const appOctokit = await authenticate({ deliverinoPrivateKey, owner, repo })
  const {
    data: { commit }
  } = await appOctokit.repos.getBranch({ owner, repo, branch })

  // Tree of the root folder of the project
  const rootTreeSha = commit.sha
  const rootTree = await appOctokit.git.getTree({ owner, repo, tree_sha: rootTreeSha })

  // Tree of the 'release-notes' folder of the project
  const releaseNoteTreeObject = rootTree.data.tree.find(it => it.path === RELEASE_NOTES_DIR)
  if (!releaseNoteTreeObject || !releaseNoteTreeObject.sha) {
    console.error(rootTree)
    throw new Error('Root tree does not contain release notes tree, probably since the response is truncated.')
  }
  const releaseNoteTree = await appOctokit.git.getTree({ owner, repo, tree_sha: releaseNoteTreeObject.sha })

  // Tree of the unreleased release notes
  const unreleasedTreeObject = releaseNoteTree.data.tree.find(it => it.path === UNRELEASED_DIR)
  if (!unreleasedTreeObject || !unreleasedTreeObject.sha) {
    console.error(releaseNoteTree)
    throw new Error('Release note tree does not contain unreleased tree, probably since the response is truncated.')
  }
  const unreleasedTree = await appOctokit.git.getTree({ owner, repo, tree_sha: unreleasedTreeObject.sha })

  // Only keep file '.gitkeep' in 'unreleased' tree, move everything else to '<new-version-name>'
  const unreleasedReleaseNotes = unreleasedTree.data.tree.filter(it => it.path !== GITKEEP_FILE)
  const keepFile = unreleasedTree.data.tree.find(it => it.path === GITKEEP_FILE)

  if (!keepFile) {
    throw new Error('.gitkeep file not found!')
  }

  // Creating an empty tree is not possible
  if (unreleasedReleaseNotes.length === 0) {
    return
  }

  // @ts-expect-error Wrong type: mode of type string is not compatible to "100644" | "100755" | "040000" | "160000" | "120000"
  const newVersionTree = await appOctokit.git.createTree({ owner, repo, tree: unreleasedReleaseNotes })
  // @ts-expect-error Wrong type: mode of type string is not compatible to "100644" | "100755" | "040000" | "160000" | "120000"
  const newUnreleasedTree = await appOctokit.git.createTree({ owner, repo, tree: [keepFile] })

  const newReleaseNotesContent = releaseNoteTree.data.tree.map(it => {
    const { size, url, ...rest } = it
    if (it.path === UNRELEASED_DIR) {
      return { ...rest, sha: newUnreleasedTree.data.sha }
    }
    return rest
  })

  // mode: '040000' means subdirectory(tree)
  // See https://developer.github.com/v3/git/trees/#create-a-tree
  newReleaseNotesContent.push({ path: newVersionName, sha: newVersionTree.data.sha, type: 'tree', mode: '040000' })

  // @ts-expect-error Wrong type: mode of type string is not compatible to "100644" | "100755" | "040000" | "160000" | "120000"
  const newReleaseNotesTree = await appOctokit.git.createTree({ owner, repo, tree: newReleaseNotesContent })

  // Update the root tree with the new 'release-notes' tree
  const rootUpdate = rootTree.data.tree.map(it => {
    const { size, url, ...rest } = it
    if (it.path === RELEASE_NOTES_DIR) {
      return { ...rest, sha: newReleaseNotesTree.data.sha }
    }
    return rest
  })
  // @ts-expect-error Wrong type: mode of type string is not compatible to "100644" | "100755" | "040000" | "160000" | "120000"
  const updatedRootTree = await appOctokit.git.createTree({ owner, repo, tree: rootUpdate })

  // Commit the changes in the tree
  const renameCommit = await appOctokit.git.createCommit({
    owner,
    repo,
    message: `Move release notes to ${newVersionName}\n[skip ci]`,
    tree: updatedRootTree.data.sha,
    parents: [commit.sha]
  })

  await appOctokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: renameCommit.data.sha
  })
}

program
  .command('move-to <new-version-name>')
  .description("move the release notes in 'unreleased' to a new subdirectory <new-version-name>")
  .action(async (newVersionName: string) => {
    try {
      await moveReleaseNotes({
        newVersionName,
        deliverinoPrivateKey: program.deliverinoPrivateKey,
        branch: program.branch,
        owner: program.owner,
        repo: program.repo
      })
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program.parse(process.argv)
