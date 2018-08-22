import { concat, map } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { Checkbox, Dropdown } from 'vtex.styleguide'

import Projects from '../queries/Projects.graphql'

interface ProjectsData {
  projects: any
}

interface FilterProps {
  appName: string
  envs: Environment[]
  handleAppChange: (event: any) => void
  handleEnvChange: (event: any) => void
}

class ReleasesListFilter extends Component<ProjectsData & FilterProps> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    const {
      appName,
      envs,
      handleAppChange,
      handleEnvChange,
      projects: { projects } } = this.props

    const projectList = projects ? projects : []
    const projectOptions = concat([{ value: 'all', label: 'All Projects' }],
      map((project: Project) => {
        return { value: project.name, label: project.name }
      }, projectList)
    )

    return (
      <div className="flex flex-column flex-row-ns flex-none justify-between-ns ph5 pv5 pv6-ns ph8-ns">
        <div className="w-25-ns">
          <Dropdown
            onChange={handleAppChange}
            options={projectOptions}
            value={appName}
          />
        </div>
        <div className="flex flex-row-ns pt4-s justify-end-s">
          <div className="pr4">
            <Checkbox
              checked={envs.includes('stable')}
              id="stable"
              label="Stable"
              value="stable"
              name="env-checkbox-group"
              onChange={handleEnvChange}
            />
          </div>
          <div>
            <Checkbox
              checked={envs.includes('beta')}
              id="beta"
              label="Beta"
              value="beta"
              name="env-checkbox-group"
              onChange={handleEnvChange}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql<ProjectsData>(Projects, {
    name: 'projects',
    options: {
      ssr: false
    }
  }),
)(ReleasesListFilter)