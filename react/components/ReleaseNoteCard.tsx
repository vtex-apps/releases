import React, { Component } from 'react'
import marked from 'marked'
import { Badge } from 'vtex.styleguide'

import TagIcon from '../icons/TagIcon'
import UserIcon from '../icons/UserIcon'

interface ReleaseNoteCardProps {
  note: ReleaseNote
}

class ReleaseNoteCard extends Component<ReleaseNoteCardProps> {
  public render() {
    const { note } = this.props
    const markdownDescription = marked(note.description)

    return (
      <div className="flex flex-column w-50-ns mw7 bg-white pa4">
        <div className="w-100 br3 br--top f3 fw5">
          <span className="heavy-blue">{note.appName}</span><span className="blue"> - {note.title}</span>
        </div>
        <div className="w-100 h3 pv4 flex flex-row items-center align-start">
          <img className="h-100 br-pill" src={note.author.gravatarURL} />
          <div className="pl3">
            <Badge>
              <TagIcon /><span className="f5 pl2">{note.version}</span>
            </Badge>
          </div>
          <div className="pl3">
            <Badge>
              <UserIcon /><span className="f5 pl2">{note.author.username}</span>
            </Badge>
          </div>
        </div>
        <div className="w-100 br3 br--bottom">
          <div className="near-black" dangerouslySetInnerHTML={{__html: markdownDescription}}></div>
        </div>
      </div>
    )
  }
}

export default ReleaseNoteCard