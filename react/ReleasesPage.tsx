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

interface ReleasesPageState {
  bottom: boolean
}

class ReleasesPage extends Component<{} & ProfileData, ReleasesPageState> {
  constructor(props: any) {
    super(props)

    this.state = {
      bottom: false,
    }
  }

  public componentDidUpdate() {
    const {
      profile: { error },
    } = this.props

    if (error) {
      const { graphQLErrors } = error
      const authError =
        graphQLErrors &&
        graphQLErrors.length > 0 &&
        graphQLErrors.find((e: any) => e.extensions.code === 'UNAUTHENTICATED')
      console.log('Authentication error, redirecting to login', authError)
      window.location.href = '/_v/segment/admin-login/v1/login?ReturnUrl=%2F'
    }
  }

  public render() {
    const {
      profile: { profile },
    } = this.props

    const firstName = profile ? profile.name.split(' ')[0] : ''

    return (
      <div
        className="w-100 h-100 bg-light-silver overflow-hidden overflow-y-scroll"
        onScroll={this.onScroll}
      >
        <div className="w-100 flex flex-row flex-none justify-between pa7-ns pt5 pl5 pr5 pb7 items-center">
          <VtexIcon />
          <div className="flex flex-row items-center justify-center">
            {firstName ? <p>{firstName}</p> : <SkeletonPiece />}
            <div className="pl3 pointer" onClick={this.logout}>
              <LogoutIcon />
            </div>
          </div>
        </div>
        <ReleasesContent bottom={this.state.bottom} />
      </div>
    )
  }

  private logout = () => {
    window.location.href = '/admin/logout?redirectUrl=/'
  }

  private onScroll = (event: any) => {
    const element = event.target
    const bottom =
      element.scrollHeight - element.scrollTop === element.clientHeight

    if (bottom) {
      this.setState({ bottom: true })
    } else if (this.state.bottom) {
      this.setState({ bottom: false })
    }
  }
}

export default graphql<ProfileData>(Profile, {
  name: 'profile',
  options: {
    ssr: false,
  },
})(ReleasesPage)
