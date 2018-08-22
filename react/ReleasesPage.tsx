import React, { Component } from 'react'

import ReleasesContent from './components/ReleasesContent'
import LogoutIcon from './icons/LogoutIcon'
import VtexIcon from './icons/VtexIcon'

import './releases.global.css'

interface ReleasesPageState {
  env: Environment
}

class ReleasesPage extends Component<{}, ReleasesPageState> {
  constructor(props: any) {
    super(props)

    this.state = {
      env: 'all'
    }
  }

  public render() {
    const { env } = this.state

    return (
      <div className="w-100 h-100 bg-light-silver overflow-hidden">
        <div className="w-100 flex flex-row justify-between pa7">
          <VtexIcon />
          <div className="flex flex-row items-center justify-center">
            <p>lcfpadilha@gmail.com</p>
            <div className="pl3 pointer">
              <LogoutIcon />
            </div>
          </div>
        </div>
        <ReleasesContent />
      </div>
    )
  }

  private handleEnvChange = (event: any) => {
    const env = event.target.value as Environment

    this.setState((prevState) => {
      return ({
        ...prevState,
        env
      })
    })
  }
}

export default ReleasesPage