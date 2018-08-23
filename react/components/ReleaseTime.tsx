import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { NoSSR } from 'render'
import moment, { Moment } from 'moment'

import SkeletonPiece from './SkeletonPiece'

interface ReleaseTimeProps {
  canAddDate: boolean
  releaseDate: Moment
}

class ReleaseTime extends Component<ReleaseTimeProps> {
  public renderDate = (date: Moment) => {
    const curDate = moment(Date.now())
    const curYear = curDate.year()

    return (
      <div className="z-1 bg-white flex flex-column pb5 pa0-ns mr6-ns items-center">
        <span className="f2 fw3 rebel-pink lh-solid">{date.date()}</span>
        <span className="f4 f4-ns fw5 black lh-title">
          <FormattedMessage id={`releases.date.months.${date.month()}`} />
        </span>
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
        <div className="flex flex-column flex-none flex-row-ns justify-center justify-end-ns mr7-ns w4-ns">
          {canAddDate ?
            this.renderDate(releaseDate)
            : null
          }
          <div className="z-1 flex h3-ns">
            <span className="f5 f4-ns bg-white fw5 gray silver-ns self-end-ns lh-copy">{releaseDate.format('HH:mm')}</span>
          </div>
        </div>
      </NoSSR>
    )
  }
}

export default ReleaseTime
