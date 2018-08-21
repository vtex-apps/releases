import { addIndex, map } from 'ramda'
import React, { Component } from 'react'
import Badge from './Badge'

import RefreshIcon from '../icons/RefreshIcon'

interface PublicationCardProps {
  publication: Publication
}

const mapAuthorWithIndex = addIndex<Author>(map)

class PublicationCard extends Component<PublicationCardProps> {
  public render() {
    const { publication } = this.props
    const isBeta = publication.environment === 'beta'
    const badgeBgColor = isBeta ? 'bg-white ba b--rebel-pink' : 'bg-rebel-pink'
    const badgeColor = isBeta ? 'rebel-pink' : 'white'

    const authors = mapAuthorWithIndex((author: Author, index: number) => {
      return (
        <div key={author.username + index} className="pl2">
          <img className="br-pill" src={author.gravatarURL} />
        </div>
      )
    }, publication.authors)

    return (
      <div className="w-75 b--silver ba br3 ph7 pv6">
        <div className="w-100 flex flex-row justify-between">
          <span className="fw4 f3 near-black">
            {publication.appName}
          </span>
          <div className="">
            <Badge className={`${badgeBgColor} ${badgeColor}`}>
              {publication.environment}
            </Badge>
            <Badge className={"ml3 near-black ba b--near-black"}>
              {publication.version}
            </Badge>
          </div>
        </div>
        <div className="w-100 mt4">
          <div className="w-100 flex flex-row justify-between">
            <div className="flex flex-row">
              {authors}
            </div>
            <div className="flex flex-row items-center">
              <RefreshIcon />
              <span className="pl3 f5 near-black">From {publication.version}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PublicationCard