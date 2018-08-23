import marked from 'marked'
import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
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
      <div className="flex-auto b--silver ba br3 pa5 ph7-ns pv6-ns">
        <div className="w-100 flex flex-column flex-row-l justify-between pb4 pb0-l">
          <div className="w-75">
            <span className="fw4 f3 near-black">
              {note.appName} - {note.title}
            </span>
          </div>
          <div className="pt4 pt0-l">
            <Badge className="near-black ba b--near-black">
              <TagIcon /><span className="f5 pl2">{note.version}</span>
            </Badge>
          </div>
        </div>
        <div className="w-100 mt4">
          <div className="w-100 flex flex-row justify-between">
            <div className="flex flex-row">
              <img
                className="br-pill w-auto"
                data-tip data-for={note.date + note.appName}
                src={note.author.gravatarURL}
                style={{ height: '40px' }}
              />
              <ReactTooltip
                id={note.date + note.appName}
                effect='solid'
                place='bottom'
              >
                <span>{note.author.username}</span>
              </ReactTooltip>
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