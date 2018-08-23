import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import ReleasesContent from './components/ReleasesContent'

import Profile from './queries/Profile.graphql'

import SkeletonPiece from './components/SkeletonPiece'
import LogoutIcon from './icons/LogoutIcon'
import VtexIcon from './icons/VtexIcon'

import './releases.global.css'

interface ProfileData {
  profile: any
}

class ReleasesPage extends Component<{} & ProfileData> {
  constructor(props: any) {
    super(props)
  }

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
            {firstName ? <p>{firstName}</p> : <SkeletonPiece />}
            <div
              className="pl3 pointer"
              onClick={this.logout}>
              <LogoutIcon />
            </div>
          </div>
        </div>
        <ReleasesContent />
      </div>
    )
  }

  private logout = () => {
    window.location.href = '/admin/logout?redirectUrl=releases'
  }
}

export default graphql<ProfileData>(Profile, {
  name: 'profile',
  options: {
    ssr: false
  }
})(ReleasesPage)