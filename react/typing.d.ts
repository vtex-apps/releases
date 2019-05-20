declare module '*.graphql' {
  import { DocumentNode } from 'graphql'

  const value: DocumentNode
  export default value
}

declare module 'vtex.styleguide' {
  import { ReactElement } from 'react'

  export const Button: ReactElement
  export const Checkbox: ReactElement
  export const Dropdown: ReactElement
  export const IconCaretRight: ReactElement
  export const Tab: ReactElement
  export const Tabs: ReactElement
  export const Radio: ReactElement
  export const Spinner: ReactElement
}

declare module 'vtex.render-runtime' {
  export const NoSSR: ReactElement
  export const Helmet: ReactElement
}

type ReleaseType = 'publication' | 'deployment'

type ContentType = 'releases' | 'notes'

type Environment = 'all' | 'stable' | 'beta'

interface Author {
  gravatarURL: string
  name: string
  username: string
}

interface Commit {
  title: string
}

interface Dependency {
  name: string
  version: string
}

interface Deployment {
  authors: Author[]
  appName: string
  commits?: Commit[]
  commitsTotal: number
  cacheId: string
  date: string
  dependencies?: Dependency[]
  environment: string
  version: string
}

interface Project {
  name: string
}

interface Publication {
  authors: Author[]
  appName: string
  cacheId: string
  date: string
  environment: string
  type: ReleaseType
  version: string
  versionFrom: string
}

interface Release {
  authors: Author[]
  appName: string
  commits?: Commit[]
  commitsTotal?: number
  cacheId: string
  date: string
  dependencies?: Dependency[]
  environment: string
  type: ReleaseType
  version: string
  versionFrom?: string
}

interface ReleaseNote {
  appName: string
  author: Author
  date: string
  description: string
  cacheId: string
  title: string
  url: string
  version: string
}

interface Statistic {
  lastHour: number
  last3Hours: number
  last7Days: number
  last30Days: number
}
