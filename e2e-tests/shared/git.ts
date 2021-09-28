import { execSync } from 'child_process'

export const getGitBranch = (): string => execSync('git rev-parse --abbrev-ref HEAD').toString().trim()

export const getGitHeadReference = (): string => execSync('git rev-parse --short HEAD').toString().trim()
