import { concat, map } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { Dropdown, Radio } from 'vtex.styleguide'

import Projects from '../queries/Projects.graphql'

interface ProjectsData {
  projects: any
}

interface FilterProps {
  appName: string
  env: Environment
  handleAppChange: (event: any) => void
  handleEnvChange: (event: any) => void
}

class ReleasesListFilter extends Component<ProjectsData & FilterProps & ReactIntl.InjectedIntlProps> {
  public render() {
    const {
      appName,
      env,
      handleAppChange,
      handleEnvChange,
      intl,
      projects: { projects } } = this.props

    const projectList = projects ? projects : []
    const projectOptions = concat(
      [
        {
          label: intl.formatMessage({ id: 'releases.filter.allProjects' }),
          value: 'all'
        }
      ],
      map((project: Project) => {
        return { value: project.name, label: project.name }
      }, projectList)
    )

    return (
      <div className="flex flex-column flex-row-ns flex-none justify-between-ns ph5 pt7 pb5 pb0-ns pt8-ns ph8-ns">
        <div className="w-25-ns">
          <Dropdown
            onChange={handleAppChange}
            options={projectOptions}
            value={appName}
          />
        </div>
        <div className="flex flex-row-ns pt4 justify-start">
          <div className="pr4">
            <Radio
              checked={env === 'all'}
              id="all"
              label={intl.formatMessage({ id: 'releases.filter.allEnvs' })}
              value="all"
              name="env-checkbox-group"
              onChange={handleEnvChange}
            />
          </div>
          <div className="pr4">
            <Radio
              checked={env === 'stable'}
              id="stable"
              label="Stable"
              value="stable"
              name="env-checkbox-group"
              onChange={handleEnvChange}
            />
          </div>
          <div>
            <Radio
              checked={env === 'beta'}
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
  injectIntl,
  graphql<ProjectsData>(Projects, {
    name: 'projects',
    options: {
      ssr: false
    }
  }),
)(ReleasesListFilter)
