import moment, { Moment } from 'moment'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { NoSSR } from 'vtex.render-runtime'

import SkeletonPiece from './SkeletonPiece'

interface ReleaseTimeProps {
  canAddDate: boolean
  releaseDate: Moment
}

class ReleaseTime extends Component<ReleaseTimeProps> {
  public render() {
    const { canAddDate, releaseDate } = this.props
    return (
      <NoSSR onSSR={this.renderSkeleton()}>
        <div className="flex flex-column flex-none flex-row-ns justify-center justify-end-ns mr7-ns w4-ns pr4 pr0-ns">
          {canAddDate ? this.renderDate(releaseDate) : null}
          <div className="z-1 flex h3-ns self-center self-start-ns">
            <span className="f6 f4-ns bg-white fw5 gray silver-ns self-end-ns lh-copy pv4 pv0-ns">
              {releaseDate.format('HH:mm')}
            </span>
          </div>
        </div>
      </NoSSR>
    )
  }

  private renderDate = (date: Moment) => {
    const curDate = moment(Date.now())
    const curYear = curDate.year()

    return (
      <div className="z-1 bg-white flex pt4 flex-column pb2 pa0-ns mr6-ns items-center">
        <span className="f2-ns f3 fw3 rebel-pink lh-solid">{date.date()}</span>
        <span className="f4-ns f6 fw5 black lh-title">
          <FormattedMessage id={`releases.date.months.${date.month()}`} />
        </span>
        {curYear !== date.year() ? (
          <span className="f3 fw5 light-gray">{date.year()}</span>
        ) : null}
      </div>
    )
  }

  private renderSkeleton = () => {
    return (
      <Fragment>
        <SkeletonPiece width={100} />
        <SkeletonPiece width={50} />
      </Fragment>
    )
  }
}

export default ReleaseTime
