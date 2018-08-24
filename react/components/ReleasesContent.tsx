import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import NavigationTab from './NavigationTab'
import ReleasesList from './ReleasesList'
import ReleasesNotesList from './ReleasesNotesList'

interface ReleasesContentProps {
  bottom: boolean
}

interface ReleasesContentState {
  appName: string
  contentType: string
}

class ReleasesContent extends Component<ReleasesContentProps, ReleasesContentState> {
  constructor(props: any) {
    super(props)

    this.state = {
      appName: 'all',
      contentType: 'releases'
    }
  }

  public render() {
    const { contentType } = this.state

    return (
      <div className="w-100 h-100 flex-auto">
        <div className="h-100 w-100 flex flex-column items-center">
          <div className="w-100 w-60-l mw9 flex flex-column">
            <div>
              <div className="ph5 mb7 ph4 ph0-ns">
                <span className="near-black f1 fw6">
                  <FormattedMessage id="releases.content.title" />
                </span>
              </div>
              <NavigationTab
                contentType={contentType}
                handleContentChange={this.handleContentChange}
              />
            </div>
            <div className="w-100 bg-white br2">
              {this.selectContent()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  private handleAppChange = (event: any) => {
    const appName = event.target.value as string

    this.setState((prevState) => {
      return ({
        ...prevState,
        appName
      })
    })
  }

  private handleContentChange = (contentType: string) => {
    this.setState({ contentType })
  }

  private selectContent = () => {
    const { appName, contentType } = this.state

    switch (contentType) {
      case 'releases':
        return (
          <ReleasesList
            appName={appName}
            handleAppChange={this.handleAppChange}
            bottom={this.props.bottom}
          />
        )
      case 'notes':
        return <ReleasesNotesList bottom={this.props.bottom} />
      default:
        return null
    }
  }
}

export default ReleasesContent
