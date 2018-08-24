import React, { Component, Fragment } from 'react'
import { NoSSR } from 'render'
import { Moment } from 'moment'

import SkeletonPiece from './SkeletonPiece'

interface ReleaseTimeProps {
  canAddDate: boolean
  releaseDate: Moment
}

class ReleaseTime extends Component<ReleaseTimeProps> {
  public renderDate = (date: Moment) => {
    return (
      <div className="pb3 flex self-end">
        <span className="f2 fw5 blue">{date.format('DD/MM/YYYY')}</span>
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
        {canAddDate ?
          this.renderDate(releaseDate)
          : null
        }
        <div className="h-100 flex self-end">
          <span className="f2 fw2 mid-gray">{releaseDate.format('HH:mm')}</span>
        </div>
      </NoSSR>
    )
  }
}

export default ReleaseTime