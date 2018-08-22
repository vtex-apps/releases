import moment from 'moment'
import { addIndex, filter, map } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql, withApollo, WithApolloClient } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'

import DeploymentCard from './DeploymentCard'
import PublicationCard from './PublicationCard'
import ReleasesListFilter from './ReleasesListFilter'
import ReleaseTime from './ReleaseTime'

import Releases from '../queries/Releases.graphql'

interface ReleasesData {
  releases: any
}

interface ReleasesQuery {
  appName: string
}

interface ReleasesListProps {
  appName: string
  handleAppChange: (event: any) => void
}

interface ReleasesListState {
  envs: Environment[]
  isLoading: boolean
  releases?: Release[]
  nextPage: number
  lastPage: boolean
}

const mapReleasesWithIndex = addIndex<Release>(map)

class ReleasesList extends Component<WithApolloClient<ReleasesData> & ReleasesListProps, ReleasesListState> {
  constructor(props: any) {
    super(props)

    this.state = {
      envs: ['stable', 'beta'],
      isLoading: false,
      lastPage: false,
      nextPage: 2,
      releases: props.releases.releases,
    }
  }

  public componentDidUpdate(prevProps: ReleasesListProps, prevState: ReleasesListState) {
    const { appName, releases: { releases: curReleases } } = this.props
    const { releases: prevReleasesState } = prevState
    const { releases } = this.state

    if (prevProps.appName !== appName) {
      this.setState((prevState) => {
        return ({
          ...prevState,
          lastPage: false,
          releases: undefined
        })
      })
    }

    if (!prevReleasesState && !releases && curReleases) {
      this.setState((prevState) => {
        return ({ ...prevState, releases: curReleases })
      })
    }
  }

  public render() {
    const { appName, handleAppChange, releases: { loading } } = this.props
    const { envs, releases } = this.state

    return (
      <div className="pt7-ns flex flex-column">
        <ReleasesListFilter 
          appName={appName}
          envs={envs}
          handleAppChange={handleAppChange}
          handleEnvChange={this.handleEnvChange}
        />
        { 
          loading || releases === undefined 
            ? this.renderLoading() 
            : this.renderReleasesList() 
        }
      </div>
    )
  }

  private handleEnvChange = (event: any) => {
    const value = event.target.value

    this.setState((prevState) => {
      const prevEnvs = prevState.envs
      const newEnvs = prevEnvs.includes(value) 
        ? filter((env: Environment) => env !== value, prevEnvs)
        : [ ...prevEnvs, value]
      return { ...prevState, envs: newEnvs }
    })
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
    const { isLoading, releases, envs } = this.state

    const filteredReleases = releases
      ? filter((release: Release) => {
        return envs.includes(release.environment as Environment)
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
        className="pa5 ph8-ns pv4-ns flex-auto overflow-y-scroll"
        onScroll={this.onScroll}
      >
        {releasesList}
        {isLoading ? this.renderLoading() : null}
      </div>
    )
  }

  private renderLoading = () => {
    return (
      <div className="w-100 flex justify-center pv4">
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