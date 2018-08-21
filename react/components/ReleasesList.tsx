import moment from 'moment'
import { addIndex, filter, map } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql, withApollo, WithApolloClient } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'

import Releases from '../queries/Releases.graphql'
import DeploymentCard from './DeploymentCard'
import PublicationCard from './PublicationCard'
import ReleaseTime from './ReleaseTime'

interface ReleasesData {
  releases: any
}

interface ReleasesQuery {
  appName: string
}

interface ReleasesListProps {
  appName: string
  env: Environment
}

interface ReleasesListState {
  isLoading: boolean,
  releases?: Release[],
  nextPage: number,
  lastPage: boolean
}

const mapReleasesWithIndex = addIndex<Release>(map)

class ReleasesList extends Component<WithApolloClient<ReleasesData> & ReleasesListProps, ReleasesListState> {
  constructor(props: any) {
    super(props)

    this.state = {
      isLoading: false,
      lastPage: false,
      nextPage: 2,
      releases: props.releases.releases,
    }
  }

  public componentDidUpdate(prevProps: ReleasesListProps, _: ReleasesListState) {
    const { appName } = this.props

    if (prevProps.appName !== appName) {
      this.setState((prevState) => {
        return ({
          ...prevState,
          lastPage: false,
          releases: undefined
        })
      })
    }
  }

  public render() {
    const { releases: { loading } } = this.props
    const { releases } = this.state

    if (!releases && !loading) {
      this.setState((prevState) => {
        return ({ ...prevState, releases: this.props.releases.releases })
      })
      return (this.renderLoading())
    }

    return (loading ? this.renderLoading() : this.renderReleasesList())
  }

  private getPage = (page: number, endDate: string) => {
    const { appName, client } = this.props

    client.query<ReleasesData>({
      query: Releases,
      variables: {
        appName,
        endDate,
        page
      }
    }).then((data) => {
      const releases = data.data.releases

      this.setState((prevState) => {
        const prevReleases = prevState.releases
          ? [...prevState.releases]
          : []
        return ({
          ...prevState,
          isLoading: false,
          lastPage: releases.length === 0,
          releases: [...prevReleases, ...releases]
        })
      })
    })
  }

  private onScroll = (event: any) => {
    const { isLoading, lastPage } = this.state
    const element = event.target
    const bottom = element.scrollHeight - element.scrollTop === element.clientHeight

    if (bottom && !isLoading && !lastPage) {
      this.setState((prevState) => {
        const nextPage = prevState.nextPage
        const releases = prevState.releases as Release[]
        const endDate = releases.length ? releases[releases.length - 1].date : ''
        this.getPage(nextPage, endDate)

        return { isLoading: true, nextPage: nextPage + 1 }
      })
    }
  }

  private renderReleasesList = () => {
    const { isLoading, releases } = this.state
    const { env } = this.props
    const filteredReleases = releases
      ? filter((release: Release) => {
        return env === 'all' || release.environment === env
      }, releases)
      : []

    const releasesList = releases
      ? mapReleasesWithIndex((release: Release, index: number) => {
        const releaseDate = moment(new Date(release.date))

        const lastRelease = index !== 0
          ? moment(new Date(releases[index - 1].date))
          : null

        const addDate =
          index === 0 ||
          lastRelease !== null &&
          releaseDate.date() !== lastRelease.date()

        return (
          <div key={release.cacheId} className="flex flex-row w-100 justify-center mb8">
            <ReleaseTime
              canAddDate={addDate}
              releaseDate={releaseDate}
            />
            {release.type === 'deployment'
              ? <DeploymentCard deployment={release as Deployment} />
              : <PublicationCard publication={release as Publication} />}
          </div>
        )
      }, filteredReleases)
      : null

    return (
      <div
        className="releases-content w-100 ph5 pv4 overflow-y-scroll overflow-x-hidden"
        onScroll={this.onScroll}
      >
        {releasesList}
        {isLoading ? this.renderLoading() : null}
      </div>
    )
  }

  private renderLoading = () => {
    return (
      <div className="w-100 flex justify-center pt4">
        <Spinner />
      </div>
    )
  }
}

const options = {
  name: 'releases',
  options: (props: ReleasesListProps) => ({
    ssr: false,
    variables: {
      appName: props.appName,
    }
  }),
}

export default compose(
  withApollo,
  graphql<ReleasesListProps, ReleasesData, ReleasesQuery>(Releases, options),
)(ReleasesList)