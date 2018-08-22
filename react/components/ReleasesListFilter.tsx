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
  handleAppChange: (event: any) => void
}

class ReleasesListFilter extends Component<ProjectsData & FilterProps> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    const { appName, handleAppChange, projects: { projects } } = this.props
    const projectList = projects ? projects : []
    const projectOptions = concat([{ value: 'all', label: 'All Projects' }],
      map((project: Project) => {
        return { value: project.name, label: project.name }
      }, projectList)
    )

    return (
      <div className="w-100 flex flex-row justify-between pv6">
        <div className="w-25">
          <Dropdown 
            onChange={handleAppChange}
            options={projectOptions}
            value={appName}
          />
        </div>
        <div className="flex flex-row">
          <div className="pr4">
            <Checkbox
              id="stable"
              label="Stable"
              value="stable"
            />
          </div>
          <div>
            <Checkbox
              id="beta"
              label="Beta"
              value="beta"
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