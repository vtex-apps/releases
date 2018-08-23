import { addIndex, map } from 'ramda'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import ReactTooltip from 'react-tooltip'
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
      const key = publication.date + author.username + index
      return (
        <div key={key} className="pl2">
          <img data-tip
            data-for={key}
            className="br-pill"
            src={author.gravatarURL}
          />
          <ReactTooltip id={key} effect='solid' place='bottom'>
            <span>{author.username}</span>
          </ReactTooltip>
        </div>
      )
    }, publication.authors)

    return (
      <div className="flex-auto b--silver ba br3 pa5 ph7-ns pv6-ns">
        <div className="w-100 flex flex-column flex-row-ns justify-between pb4 pb0-ns">
          <span className="fw4 f3 near-black">
            {publication.appName}
          </span>
          <div className="pt4 pt0-ns">
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
              <span className="pl3 f5 near-black">
                <FormattedMessage id="releases.card.from" /> {publication.version}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PublicationCard