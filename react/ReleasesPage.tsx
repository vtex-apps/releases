import React, { Component } from 'react'

import ReleasesContent from './components/ReleasesContent'
import LogoutIcon from './icons/LogoutIcon'
import VtexIcon from './icons/VtexIcon'

import './releases.global.css'


class ReleasesPage extends Component {
  public render() {
    return (
      <div className="w-100 h-100 bg-light-silver overflow-hidden flex flex-column">
        <div className="w-100 flex flex-row flex-none justify-between pa7">
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