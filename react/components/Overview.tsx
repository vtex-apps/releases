import { addIndex, map } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql, withApollo, WithApolloClient } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import Statistic from '../queries/Statistic.graphql'
import SkeletonPiece from './SkeletonPiece'

interface StatisticData {
  statistic: any
}

interface OverviewProps {
  appName: string
  env: string
  statistic: any
}

const STATISTIC_NAMES = ['hour', '3hours', '7days', '30days']
const mapWithIndex = addIndex<number, JSX.Element>(map)

class Overview extends Component<WithApolloClient<StatisticData> & OverviewProps> {
  public render() {
    const { statistic: { loading, statistic } } = this.props

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
            {loading 
              ? <SkeletonPiece color="light-silver" height={5} width={3}/> 
              : <span className="f2 fw5">{stat}</span> }
          </div>
        </div>
      )
    }, statisticNumbers)

    return (
      <div className="flex flex-column">
        <div className="flex flex-column flex-row-ns items-center justify-between-ns pv7">
          {statisticElements}
        </div>
      </div>
    )
  }
}

const statisticOptions = {
  name: 'statistic',
  options: (props: OverviewProps) => ({
    ssr: false,
    variables: {
      appName: props.appName,
      env: props.env
    },
  }),
}

export default compose(
  withApollo,
  graphql<OverviewProps, StatisticData>(Statistic, statisticOptions),
)(Overview)
