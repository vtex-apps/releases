import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import ReleasesContent from './components/ReleasesContent'

import Profile from './queries/Profile.graphql'

import LogoutIcon from './icons/LogoutIcon'
import VtexIcon from './icons/VtexIcon'

import './releases.global.css'

interface ProfileData {
  profile: any
}

class ReleasesPage extends Component<{} & ProfileData> {
  public render() {
    const { profile: { profile } } = this.props

    const firstName = profile
      ? profile.name.split(' ')[0]
      : ''

    return (
      <div className="w-100 h-100 bg-light-silver overflow-hidden flex flex-column">
        <div className="w-100 flex flex-row flex-none justify-between pa7">
          <VtexIcon />
          <div className="flex flex-row items-center justify-center">
            <p>{firstName}</p>
            <div className="pl3 pointer">
              <LogoutIcon />
            </div>
          </div>
        </div>
        <ReleasesContent />
      </div>
    )
  }
}

export default graphql<ProfileData>(Profile, {
  name: 'profile',
  options: {
    ssr: false
  }
})(ReleasesPage)