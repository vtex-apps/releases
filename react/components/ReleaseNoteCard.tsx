import marked from 'marked'
import React, { Component } from 'react'
import Badge from './Badge'

import TagIcon from '../icons/TagIcon'

interface ReleaseNoteCardProps {
  note: ReleaseNote
}

class ReleaseNoteCard extends Component<ReleaseNoteCardProps> {
  public render() {
    const { note } = this.props
    const markdownDescription = marked(note.description)

    return (
      <div className="w-75 b--silver ba br3 ph7 pv6">
        <div className="w-100 flex flex-row justify-between">
          <div className="w-75">
            <span className="fw4 f3 near-black">
              {note.appName} - {note.title}
            </span>
          </div>
          <div className="">
            <Badge className="near-black ba b--near-black">
              <TagIcon /><span className="f5 pl2">{note.version}</span>
            </Badge>
          </div>
        </div>
        <div className="w-100 mt4">
          <div className="w-100 flex flex-row justify-between">
            <div className="flex flex-row">
              <img className="br-pill w-auto" src={note.author.gravatarURL} style={{ height: '40px' }}/>
            </div>
          </div>
          <div className="w-100 br3 br--bottom">
            <div className="near-black" dangerouslySetInnerHTML={{ __html: markdownDescription }}></div>
          </div>
        </div>
      </div>
    )
  }
}

export default ReleaseNoteCard