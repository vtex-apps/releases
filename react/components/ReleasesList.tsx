import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { addIndex, filter, map } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql, withApollo } from 'react-apollo'
import moment from 'moment'
import { Spinner } from 'vtex.styleguide'

import Releases from '../queries/Releases.graphql'
import DeploymentCard from './DeploymentCard'
import PublicationCard from './PublicationCard'
import ReleaseTime from './ReleaseTime'

interface ReleasesData {
  releases?: any
}

interface ReleasesListProps {
  appName: string
  client: ApolloClient<any>
  releases?: any
  env: Environment
}

interface ReleasesListState {
  isLoading: boolean,
  releases: any,
  nextPage: number,
  lastPage: boolean
}

const mapWithIndex = addIndex(map)

class ReleasesList extends Component<ReleasesListProps, ReleasesListState> {
  constructor(props: any) {
    super(props)

    this.state = {
      nextPage: 2,
      isLoading: false,
      releases: props.releases.releases,
      lastPage: false
    }
  }

  public componentDidUpdate(prevProps: ReleasesListProps, _) {
    const { appName } = this.props

    if (prevProps.appName !== appName) {
      this.setState((prevState) => {
        return ({ ...prevState, lastPage: false, releases: null })
      })
    }
  }

  public getPage = (page: number, endDate: string) => {
    const { appName, client } = this.props

    client.query({
      query: Releases,
      variables: {
        appName,
        page,
        endDate
      }
    }).then((data: ApolloQueryResult<ReleasesData>) => {
      const releases = data.data.releases

      this.setState((prevState) => {
        return ({
          ...prevState,
          isLoading: false,
          lastPage: releases.length === 0,
          releases: [...prevState.releases, ...releases]
        })
      })
    })
  }

  public onScroll = (event: any) => {
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

  public renderReleasesList = () => {
    const { isLoading, releases } = this.state
    const { env } = this.props
    const filteredReleases = filter((release: Release) => {
      return env === 'all' || release.environment === env
    }, releases)

    const releasesList = releases
      ? mapWithIndex((release: Release, index: number) => {
        const releaseDate = moment(new Date(release.date))

        const lastRelease = index !== 0
          ? moment(new Date(releases[index - 1].date))
          : null

        const addDate =
          index === 0 ||
          releaseDate.date() !== lastRelease.date()

        return (
          <div key={release.cacheId} className="flex flex-row w-100 pl9 pt8 justify-center">
            <div className="flex flex-column h-100 w5 mr7 pr7">
              <ReleaseTime
                canAddDate={addDate}
                releaseDate={releaseDate}
              />
            </div>
            {release.type === 'deployment'
              ? <DeploymentCard deployment={release as Deployment} />
              : <PublicationCard publication={release as Publication} />}
          </div>
        )
      }, filteredReleases)
      : null

    return (
      <div
        className="releases-content w-100 flex flex-row flex-wrap items-center bg-light-silver pv4 overflow-y-scroll overflow-x-hidden"
        onScroll={this.onScroll}
      >
        {releasesList}
        {isLoading ? this.renderLoading() : null}
      </div>
    )
  }

  public renderLoading = () => {
    return (
      <div className="w-100 flex justify-center bg-light-silver pt4">
        <Spinner />
      </div>
    )
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
}

const options = {
  name: 'releases',
  options: props => ({
    variables: {
      appName: props.appName,
    },
  }),
}

export default compose(
  withApollo,
  graphql<ReleasesData>(Releases, options),
)(ReleasesList)