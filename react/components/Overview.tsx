import { addIndex, filter, map } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'

import Statistic from '../queries/Statistic.graphql'
import ReleasesListFilter from './ReleasesListFilter'

interface StatisticData {
  statistic: any
}

interface OverviewState {
  envs: Environment[]
}

interface OverviewProps {
  appName: string
  handleAppChange: (event: any) => void
  statistic: any
}

const STATISTIC_NAMES = [ 'LAST HOUR', 'LAST 3 HOURS', 'LAST 7 DAYS', 'LAST 30 DAYS' ]
const mapWithIndex = addIndex<number, JSX.Element>(map)

class Overview extends Component<OverviewProps, OverviewState> {
  constructor(props: any) {
    super(props)

    this.state = {
      envs: ['stable', 'beta']
    }
  }

  public handleEnvChange = (event: any) => {
    const value = event.target.value

    this.setState((prevState) => {
      const prevEnvs = prevState.envs
      const newEnvs = prevEnvs.includes(value)
        ? filter((env: Environment) => env !== value, prevEnvs)
        : [...prevEnvs, value]
      return { ...prevState, envs: newEnvs }
    })
  }

  public renderStatistics = () => {
    const { statistic: { statistic } } = this.props
    const { envs } = this.state
    let lastHour, last3Hours, last7Days, last30Days
    lastHour = last3Hours = last7Days = last30Days = 0

    if (envs.includes('stable')) {
      lastHour += statistic.stableLastHour
      last3Hours += statistic.stableLast3Hours
      last7Days += statistic.stableLast7Days
      last30Days += statistic.stableLast30Days
    }

    if (envs.includes('beta')) {
      lastHour += statistic.preReleaseLastHour
      last3Hours += statistic.preReleaseLast3Hours
      last7Days += statistic.preReleaseLast7Days
      last30Days += statistic.preReleaseLast30Days
    }

    const statisticNumbers = [ lastHour, last3Hours, last7Days, last30Days ]
    const statisticElements = mapWithIndex((stat: number, index: number) => {
      const name = STATISTIC_NAMES[index]
      return (
        <div key={name} className="w-50 flex flex-column">
          <div className="w-100 flex justify-center">
            <span className="silver f5 fw4 tracked">{name}</span>
          </div>
          <div className="flex justify-center">
            <span className="f2 fw5">{stat}</span>
          </div>
        </div>
      )
    }, statisticNumbers)

    return (
      <div className="flex flex-row-ns justify-between-ns pv7">
        {statisticElements}
      </div>
    )
  }

  public renderLoading = () => {
    return (
      <div className="w-100 flex justify-center pv4">
        <Spinner />
      </div>
    )
  }

  public render() {
    const { appName, handleAppChange, statistic: { loading } } = this.props
    const { envs } = this.state

    return (
      <div className="pt7 flex flex-column">
        <ReleasesListFilter
          appName={appName}
          envs={envs}
          handleAppChange={handleAppChange}
          handleEnvChange={this.handleEnvChange}
        />
        { loading ? this.renderLoading() : this.renderStatistics()}
      </div>
    )
  }
}

export default compose(
  graphql<StatisticData>(Statistic, {
    name: 'statistic',
    options: {
      ssr: false
    }
  }),
)(Overview)