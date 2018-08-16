import { concat, map } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql, WithApolloClient } from 'react-apollo'
import { Motion, spring, presets } from 'react-motion'

import { Button, Dropdown } from 'vtex.styleguide'
import Projects from '../queries/Projects.graphql'
import Statistic from '../queries/Statistic.graphql'

interface ProjectsData {
  projects: any
}

interface StatisticsData {
  statistic: any
}

interface ReleasesSidebarProps {
  appName: string
  contentType: ContentType
  env: Environment
  handleAppChange: (event: any) => void
  handleContentChange: (event: any) => void
  handleEnvChange: (event: any) => void
}

class ReleasesSidebar extends Component<WithApolloClient<ProjectsData> & WithApolloClient<StatisticsData> & ReleasesSidebarProps> {
  public render() {
    const {
      appName,
      contentType,
      env,
      handleAppChange,
      handleEnvChange,
      handleContentChange,
      projects: { projects },
      statistic: { statistic }
    } = this.props
    let lastHour, last3Hours, last7Days, last30Days

    if (env === 'stable') {
      lastHour = statistic.stableLastHour
      last3Hours = statistic.stableLast3Hours
      last7Days = statistic.stableLast7Days
      last30Days = statistic.stableLast30Days

    } else if (env === 'beta') {
      lastHour = statistic.preReleaseLastHour
      last3Hours = statistic.preReleaseLast3Hours
      last7Days = statistic.preReleaseLast7Days
      last30Days = statistic.preReleaseLast30Days
    } else {
      lastHour = statistic.preReleaseLastHour + statistic.stableLastHour
      last3Hours = statistic.preReleaseLast3Hours + statistic.stableLast3Hours
      last7Days = statistic.preReleaseLast7Days + statistic.stableLast7Days
      last30Days = statistic.preReleaseLast30Days + statistic.stableLast30Days
    }

    const projectOptions = concat([{ value: 'all', label: 'All Projects' }],
      map((project: Project) => {
        return { value: project.name, label: project.name }
      }, projects)
    )
    const envOptions = [
      { value: 'all', label: 'All Environments' },
      { value: 'stable', label: 'Stable' },
      { value: 'beta', label: 'Beta' }]

    return (
      <div
        className="flex flex-none white pa4 b--light-gray bw2 h-100-ns br-ns flex-column-ns items-center-ns"
        style={{
          backgroundColor: "#36b7d7",
          width: "300px"
        }}>
        <div className="flex flex-column flex-none items-center">
          <span className="vtex-logo" />
          <span className="f2">RELEASES</span>
          <div className="flex flex-row w-100 ph6 pv5">
            <div className="w-100 mr3">
              <Button
                id='releases'
                variation={contentType === 'releases' ? 'primary' : 'tertiary'}
                size="small"
                onClick={handleContentChange}
              >
                Releases
              </Button>
            </div>
            <div className="w-100">
              <Button
                id='notes'
                variation={contentType === 'notes' ? 'primary' : 'tertiary'}
                size="small"
                onClick={handleContentChange}
              >
                Notes
              </Button>
            </div>
          </div>
        </div>
        <div className={contentType === 'notes' ? 'dn' : 'h-100 w-100'}>
          <div className="w-100 ph6 flex flex-column">
            <div className="pv2">
              <Dropdown
                onChange={handleAppChange}
                options={projectOptions}
                value={appName}
              />
            </div>
            <div className="pv2">
              <Dropdown
                onChange={handleEnvChange}
                options={envOptions}
                value={env}
              />
            </div>
          </div>
          <div className="w-100 ph3 pt5 flex flex-column">
            <div className="w-100 flex flex-row">
              <div className="w-50 flex flex-column">
                <div className="w-100 flex justify-center">
                  <span className="near-black o-50 f5 fw6">LAST HOUR</span>
                </div>
                <div className="w-100 flex justify-center">
                  <Motion defaultStyle={{ number: 0 }} style={{ number: spring(lastHour, presets.wobbly) }}>
                    {value => <span className="f2">{Math.floor(value.number)}</span>}
                  </Motion>
                </div>
              </div>
              <div className="w-50 flex flex-column">
                <div className="w-100 flex justify-center">
                  <span className="near-black o-50 f5 fw6">LAST 3 HOURS</span>
                </div>
                <div className="w-100 flex justify-center">
                  <Motion defaultStyle={{ number: 0 }} style={{ number: spring(last3Hours, presets.wobbly) }}>
                    {value => <span className="f2">{Math.floor(value.number)}</span>}
                  </Motion>
                </div>
              </div>
            </div>
            <div className="w-100 flex flex-row mt3">
              <div className="w-50 flex flex-column">
                <div className="w-100 flex justify-center">
                  <span className="near-black o-50 f5 fw6">LAST 7 DAYS</span>
                </div>
                <div className="w-100 flex justify-center">
                  <Motion defaultStyle={{ number: 0 }} style={{ number: spring(last7Days, presets.wobbly) }}>
                    {value => <span className="f2">{Math.floor(value.number)}</span>}
                  </Motion>
                </div>
              </div>
              <div className="w-50 flex flex-column">
                <div className="w-100 flex justify-center">
                  <span className="near-black o-50 f5 fw6">LAST 30 DAYS</span>
                </div>
                <div className="w-100 flex justify-center">
                  <Motion defaultStyle={{ number: 0 }} style={{ number: spring(last30Days, presets.wobbly) }}>
                    {value => <span className="f2">{Math.floor(value.number)}</span>}
                  </Motion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const statisticOptions = {
  name: 'statistic',
  options: (props: ReleasesSidebarProps) => ({
    variables: {
      appName: props.appName,
    },
  }),
}

export default compose(
  graphql<ProjectsData>(Projects, { name: 'projects' }),
  graphql<ReleasesSidebarProps, StatisticsData>(Statistic, statisticOptions)
)(ReleasesSidebar)