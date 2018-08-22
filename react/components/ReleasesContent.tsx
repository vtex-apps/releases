import React, { Component } from 'react'
import { Tab, Tabs } from 'vtex.styleguide'

import ReleasesList from './ReleasesList'
import ReleasesNotesList from './ReleasesNotesList'

interface ReleasesContentState {
  appName: string
  contentType: string
}

class ReleasesContent extends Component<{}, ReleasesContentState> {
  constructor(props: any) {
    super(props)

    this.state = {
      appName: 'all',
      contentType: 'releases'
    }
  }
  
  public handleAppChange = (event: any) => {
    const appName = event.target.value as string

    this.setState((prevState) => {
      return ({
        ...prevState,
        appName
      })
    })
  }

  public handleContentChange = (contentType: string) => {
    this.setState({ contentType })
  }

  public selectContent = () => {
    const { appName, contentType } = this.state

    switch(contentType) {
      case 'releases':
        return (
          <ReleasesList 
            appName={appName} 
            env={'all'}
            handleAppChange={this.handleAppChange}
          />
        )
      case 'notes':
        return <ReleasesNotesList />
      default:
        return null
    }
  }

  public render() {
    const { contentType } = this.state

    return (
      <div className="w-100 h-100">
        <div className="h-100 w-100 flex flex-column items-center">
          <div className="h-100 w-75 mw9">
            <div className="ph5">
              <div className="mb7">
                <span className="near-black f1 fw6">Latest Releases</span>
              </div>
              <Tabs>
                <Tab label="Overview" active={contentType === 'overview'} onClick={() => this.handleContentChange('overview')} />
                <Tab label="Releases" active={contentType === 'releases'} onClick={() => this.handleContentChange('releases')} />
                <Tab label="Releases Notes" active={contentType === 'notes'} onClick={() => this.handleContentChange('notes')}/>
                <Tab label="My apps" active={contentType === 'apps'} onClick={() => this.handleContentChange('apps')}/>
              </Tabs>
            </div>
            <div className="w-100 h-100 ph8 bg-white br2 overflow-y-scroll">
              { this.selectContent() }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ReleasesContent