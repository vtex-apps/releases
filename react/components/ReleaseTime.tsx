import React, { Component, Fragment } from 'react'
import { NoSSR } from 'render'
import moment, { Moment } from 'moment'

import SkeletonPiece from './SkeletonPiece'

interface ReleaseTimeProps {
  canAddDate: boolean
  releaseDate: Moment
}

const MONTHS = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ]

class ReleaseTime extends Component<ReleaseTimeProps> {
  public renderDate = (date: Moment) => {
    const curDate = moment(Date.now())
    const curYear = curDate.year()

    return (
      <div className="z-1 bg-white flex flex-column pb5 pa0-ns mr8-ns items-center">
        <span className="f2 fw3 rebel-pink">{date.date()}</span>
        <span className="f4 f3-ns fw5 black">{MONTHS[date.month()]}</span>
        {curYear !== date.year() ? <span className="f3 fw5 light-gray">{date.year()}</span> : null}
      </div>
    )
  }

  public renderSkeleton = () => {
    return (
      <Fragment>
        <SkeletonPiece width={100} />
        <SkeletonPiece width={50} />
      </Fragment>
    )
  }

  public render() {
    const { canAddDate, releaseDate } = this.props
    return (
      <NoSSR onSSR={this.renderSkeleton()}>
        <div className="flex flex-column flex-none flex-row-ns justify-center justify-end-ns w-20 w5-ns pr6">
          {canAddDate ?
            this.renderDate(releaseDate)
            : null
          }
          <div className="z-1 flex self-center bg-white">
            <span className="f5 f3-ns fw5 gray silver-ns">{releaseDate.format('HH:mm')}</span>
          </div>
        </div>
      </NoSSR>
    )
  }
}

export default ReleaseTime