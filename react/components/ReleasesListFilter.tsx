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

interface ProjectListOptions {
  label: JSX.Element | string
  value: string
}

class ReleasesListFilter extends Component<ProjectsData & FilterProps & ReactIntl.InjectedIntlProps> {
  constructor(props: any) {
    super(props)
  }

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
          value: 'all',
          label: intl.formatMessage({ id: 'releases.filter.allProjects' })
        }
      ],
      map((project: Project) => {
        return { value: project.name, label: project.name }
      }, projectList)
    )

    return (
      <div className="flex flex-column flex-row-ns flex-none justify-between-ns ph5 pt5 pv6-ns ph8-ns">
        <div className="w-25-ns">
          <Dropdown
            onChange={handleAppChange}
            options={projectOptions}
            value={appName}
          />
        </div>
        <div className="flex flex-row-ns pt4-s justify-end-s">
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