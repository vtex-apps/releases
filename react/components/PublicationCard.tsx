import { addIndex, map } from 'ramda'
import React, { Component } from 'react'
import { Badge } from 'vtex.styleguide'

import RefreshIcon from '../icons/RefreshIcon'
import UserIcon from '../icons/UserIcon'

interface PublicationCardProps {
  publication: Publication
}

const mapAuthorWithIndex = addIndex<Author>(map)

class PublicationCard extends Component<PublicationCardProps> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    const { publication } = this.props
    const authors = mapAuthorWithIndex((author: Author, index: number) => {
      return (
        <div key={author.username + index} className="pl2">
          <img className="br-pill" src={author.gravatarURL} />
        </div>
      )
    }, publication.authors)

    return (
      <div className="flex flex-column w-50-ns mw7">
        <div className="flex flex-row justify-between w-100 bg-white pv3 ph5 br2 br--top">
          <div className="flex align-start">
            <span className={"f3 fw5 elite-purple"}>{publication.appName}</span>
          </div>
          <div className="flex align-end">
            <div className="pr2">
              <Badge>
                <span className="f5">{publication.version}</span>
              </Badge>
            </div>
            <div className="pl2">
              <Badge bgColor={`${publication.environment === 'beta' ? '#727273' : '#6A3C9B'}`} color={"#fff"}>
                <span className="f5">{publication.environment}</span>
              </Badge>
            </div>
          </div>
        </div>
        <div className="h3 br2 br--bottom bg-elite-purple ph3">
          <div className="h-100 flex items-center">
            {authors}
            <div className="pl3">
              <Badge>
                <div className="flex flex-row items-center">
                  <RefreshIcon /><span className="pl2 f5">From {publication.versionFrom}</span>
                </div>
              </Badge>
            </div>
            <div className="pl3">
              <Badge>
                <div className="flex flex-row items-center">
                  <UserIcon /><span className="pl2 f5">{publication.authors ? publication.authors[0].username.split('@')[0] : ''}</span>
                </div>
              </Badge>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PublicationCard