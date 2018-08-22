declare module '*.graphql' {
  import { DocumentNode } from 'graphql'

  const value: DocumentNode
  export default value
}

declare module 'vtex.styleguide' {
  import { ReactElement } from 'react'

  const Badge: ReactElement
  const Button: ReactElement
  const Checkbox: ReactElement
  const Dropdown: ReactElement
  const IconCaretRight: ReactElement
  const Tab: ReactElement
  const Tabs: ReactElement
  const Spinner: ReactElement

  export { Badge, Button, Checkbox, Dropdown, IconCaretRight, Tab, Tabs, Spinner }
}

declare module 'render' {
  import { ReactElement } from 'react'
  const NoSSR: ReactElement

  export { NoSSR }
}


type ReleaseType = 'publication' | 'deployment'

type ContentType = 'releases' | 'notes'

type Environment = 'stable' | 'beta'

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
  authors: Author[],
  appName: string,
  commits?: Commit[]
  commitsTotal: number,
  cacheId: string,
  date: string,
  dependencies?: Dependency[]
  environment: string,
  version: string
}

interface Project {
  name: string
}

interface Publication {
  authors: Author[],
  appName: string,
  cacheId: string,
  date: string,
  environment: string,
  type: ReleaseType,
  version: string,
  versionFrom: string
}

interface Release {
  authors: Author[],
  appName: string,
  commits?: Commit[]
  commitsTotal?: number,
  cacheId: string,
  date: string,
  dependencies?: Dependency[]
  environment: string,
  type: ReleaseType,
  version: string,
  versionFrom?: string
}

interface ReleaseNote {
  appName: string,
  author: Author,
  date: string,
  description: string,
  cacheId: string,
  title: string,
  url: string,
  version: string
}

interface Statistic {
  stableLastHour: number,
  stableLast3Hours: number,
  stableLast7Days: number,
  stableLast30Days: number,
  preReleaseLastHour: number,
  preReleaseLast3Hours: number,
  preReleaseLast7Days: number,
  preReleaseLast30Days: number
}
