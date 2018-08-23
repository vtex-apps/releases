import { FormattedMessage } from 'react-intl'
import { addIndex, map } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql, withApollo, WithApolloClient } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'

import Statistic from '../queries/Statistic.graphql'
import ReleasesListFilter from './ReleasesListFilter'

interface StatisticData {
  statistic: any
}

interface OverviewState {
  env: Environment
  loadingNewEnv: boolean
  statistic?: Statistic
}

interface OverviewProps {
  appName: string
  handleAppChange: (event: any) => void
  statistic: any
}

const STATISTIC_NAMES = ['hour', '3hours', '7days', '30days']
const mapWithIndex = addIndex<number, JSX.Element>(map)

class Overview extends Component<WithApolloClient<StatisticData> & OverviewProps, OverviewState> {
  constructor(props: any) {
    super(props)

    this.state = {
      env: 'all',
      statistic: undefined,
      loadingNewEnv: true
    }
  }

  public componentDidUpdate(_: OverviewProps, prevState: OverviewState) {
    const { appName, client, statistic: { statistic: curStatInProps } } = this.props
    const { env: currEnv, statistic: curStatInState } = this.state
    const { env: prevEnv, statistic: prevStatInState } = prevState

    if (prevEnv != currEnv) {
      client.query<StatisticData>({
        query: Statistic,
        variables: {
          appName,
          env: currEnv
        }
      }).then((data) => {
        const statistic = data.data.statistic
        console.log(statistic)
        this.setState((prevState) => {
          return ({
            ...prevState,
            loadingNewEnv: false,
            statistic
          })
        })
      })
    }

    if (curStatInProps && !curStatInState && !prevStatInState) {
      this.setState((prevState) => {
        return ({
          ...prevState,
          loadingNewEnv: false,
          statistic: curStatInProps
        })
      })
    }
  }

  public handleEnvChange = (event: any) => {
    const newEnv = event.target.value

    this.setState((prevState) => {
      return { ...prevState, loadingNewEnv: true, env: newEnv }
    })
  }

  public renderStatistics = () => {
    const { statistic } = this.state

    const statisticNumbers = [
      statistic ? statistic.lastHour : 0, 
      statistic ? statistic.last3Hours : 0, 
      statistic ? statistic.last7Days : 0, 
      statistic ? statistic.last30Days : 0
    ]
    const statisticElements = mapWithIndex((stat: number, index: number) => {
      const name = STATISTIC_NAMES[index]
      return (
        <div key={name} className="w-50 pb6 pa0-ns flex flex-column">
          <div className="w-100 flex justify-center">
            <span className="silver f5 fw4 tracked">
              <FormattedMessage id={`releases.overview.${name}`} />
            </span>
          </div>
          <div className="flex justify-center">
            <span className="f2 fw5">{stat}</span>
          </div>
        </div>
      )
    }, statisticNumbers)

    return (
      <div className="flex flex-column flex-row-ns items-center justify-between-ns pv7">
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
    const { appName, handleAppChange, statistic: { loading: queryLoading } } = this.props
    const { env, loadingNewEnv } = this.state
    const loading = queryLoading || loadingNewEnv

    return (
      <div className="flex flex-column">
        <ReleasesListFilter
          appName={appName}
          env={env}
          handleAppChange={handleAppChange}
          handleEnvChange={this.handleEnvChange}
        />
        {loading ? this.renderLoading() : this.renderStatistics()}
      </div>
    )
  }
}

const statisticOptions = {
  name: 'statistic',
  options: (props: OverviewProps) => ({
    variables: {
      appName: props.appName,
    },
    ssr: false
  }),
}

export default compose(
  withApollo,
  graphql<OverviewProps, StatisticData>(Statistic, statisticOptions),
)(Overview)
