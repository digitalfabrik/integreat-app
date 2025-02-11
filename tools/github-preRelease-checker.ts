type GitHubRelease = {
  id: number
  tag_name: string
  name: string
  draft: boolean
  prerelease: boolean
  created_at: string
  published_at: string
}

const isLatestReleasePreRelease = async (platform: string): Promise<boolean> => {
  try {
    const response = await fetch('https://api.github.com/repos/digitalfabrik/integreat-app/releases')
    const releases = await response.json()

    const filtered: GitHubRelease[] = releases.filter(
      (release: GitHubRelease) => !release.draft && release.name.startsWith(`[${platform}]`),
    )

    if (filtered.length === 0) {
      return false
    }

    filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

    const latestRelease = filtered[0]

    return !!latestRelease?.prerelease
  } catch (error) {
    console.error('Error at checking pre-release tags:', error)
    return false
  }
}

export default isLatestReleasePreRelease
