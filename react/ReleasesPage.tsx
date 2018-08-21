import React, { Component } from 'react'

import ReleasesContent from './components/ReleasesContent'

import VtexIcon from './icons/VtexIcon'
import LogoutIcon from './icons/LogoutIcon'

import './releases.global.css'

interface ReleasesPageState {
  app: string
  contentType: ContentType
  env: Environment
}

class ReleasesPage extends Component<{}, ReleasesPageState> {
  constructor(props: any) {
    super(props)

    this.state = {
      app: 'all',
      contentType: 'releases',
      env: 'all'
    }
  }

  public render() {
    const { app, contentType, env } = this.state

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

  private handleAppChange = (event: any) => {
    const app = event.target.value as string

    this.setState((prevState) => {
      return ({
        ...prevState,
        app
      })
    })
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

  private handleContentChange = (event: any) => {
    const contentType = event.currentTarget.id as ContentType

    this.setState((prevState) => {
      return ({
        ...prevState,
        contentType
      })
    })
  }
}

export default ReleasesPage