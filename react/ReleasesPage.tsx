import React, { Component } from 'react'

import ReleasesList from './components/ReleasesList'
import ReleasesNotesList from './components/ReleasesNotesList'
import ReleasesSidebar from './components/ReleasesSidebar'

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
      <div className="w-100 h-100-ns flex-ns flex-row-ns">
        <ReleasesSidebar
          appName={app}
          contentType={contentType}
          env={env}
          handleAppChange={this.handleAppChange}
          handleContentChange={this.handleContentChange}
          handleEnvChange={this.handleEnvChange}
        />
        {
          contentType === 'releases'
            ? <ReleasesList env={env} appName={app} />
            : <ReleasesNotesList />
        }
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