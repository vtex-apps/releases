import moment from 'moment'
import { addIndex, filter, map } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql, withApollo, WithApolloClient } from 'react-apollo'
import { injectIntl } from 'react-intl'

import { Helmet } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'

import DeploymentCard from './DeploymentCard'
import Overview from './Overview'
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
  bottom: boolean
  handleAppChange: (event: any) => void
}

interface ReleasesListState {
  env: Environment
  isLoading: boolean
  releases?: Release[]
  nextPage: number
  lastPage: boolean
}

const mapReleasesWithIndex = addIndex<Release>(map)

class ReleasesList extends Component<
  WithApolloClient<ReleasesData> &
    ReleasesListProps &
    ReactIntl.InjectedIntlProps,
  ReleasesListState
> {
  constructor(props: any) {
    super(props)

    this.state = {
      env: 'all',
      isLoading: false,
      lastPage: false,
      nextPage: 2,
      releases: props.releases.releases,
    }
  }

  public componentDidUpdate(
    prevProps: ReleasesListProps,
    prevState: ReleasesListState
  ) {
    const {
      appName,
      bottom,
      releases: { releases: curReleases },
    } = this.props
    const { releases: prevReleasesState } = prevState
    const { releases } = this.state

    if (prevProps.appName !== appName) {
      this.setState(pState => {
        return {
          ...pState,
          lastPage: false,
          releases: undefined,
        }
      })
    }

    if (!prevReleasesState && !releases && curReleases) {
      this.setState(pState => {
        return { ...pState, releases: curReleases }
      })
    }

    if (!prevProps.bottom && bottom) {
      this.setState(pState => {
        const nextPage = pState.nextPage
        const currReleases = pState.releases as Release[]
        const endDate = currReleases.length
          ? currReleases[currReleases.length - 1].date
          : ''
        this.getPage(nextPage, endDate)

        return { ...pState, isLoading: true, nextPage: nextPage + 1 }
      })
    }
  }

  public render() {
    const {
      appName,
      handleAppChange,
      releases: { loading },
      intl,
    } = this.props
    const { env, releases } = this.state

    return (
      <div>
        <Helmet
          title={intl.formatMessage({
            id: 'releases.content.releases',
          })}
        />
        <ReleasesListFilter
          appName={appName}
          env={env}
          handleAppChange={handleAppChange}
          handleEnvChange={this.handleEnvChange}
        />
        <Overview appName={appName} env={env} />
        {loading || releases === undefined
          ? this.renderLoading()
          : this.renderReleasesList()}
      </div>
    )
  }

  private handleEnvChange = (event: any) => {
    const newEnv = event.target.value

    this.setState(prevState => {
      return { ...prevState, env: newEnv }
    })
  }

  private getPage = (page: number, endDate: string) => {
    const { appName, client } = this.props

    client
      .query<ReleasesData>({
        query: Releases,
        variables: {
          appName,
          endDate,
          page,
        },
      })
      .then(data => {
        const releases = data.data.releases

        this.setState(prevState => {
          const prevReleases = prevState.releases ? [...prevState.releases] : []
          return {
            ...prevState,
            isLoading: false,
            lastPage: releases.length === 0,
            releases: [...prevReleases, ...releases],
          }
        })
      })
  }

  private renderReleasesList = () => {
    const { isLoading, releases, env } = this.state

    const filteredReleases = releases
      ? filter((release: Release) => {
          return env === 'all' || release.environment === env
        }, releases)
      : []

    const releasesList = releases
      ? mapReleasesWithIndex((release: Release, index: number) => {
          const releaseDate = moment(new Date(release.date))

          const lastRelease =
            index !== 0 ? moment(new Date(releases[index - 1].date)) : null

          const addDate =
            index === 0 ||
            (lastRelease !== null && releaseDate.date() !== lastRelease.date())

          return (
            <div
              key={release.cacheId}
              className="timeline relative flex flex-row w-100 justify-center pb8"
            >
              <ReleaseTime canAddDate={addDate} releaseDate={releaseDate} />
              {release.type === 'deployment' ? (
                <DeploymentCard deployment={release as Deployment} />
              ) : (
                <PublicationCard publication={release as Publication} />
              )}
            </div>
          )
        }, filteredReleases)
      : null

    return (
      <div className="pa5 ph8-ns pv6-ns">
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
    },
  }),
}

export default compose(
  injectIntl,
  withApollo,
  graphql<ReleasesListProps, ReleasesData, ReleasesQuery>(Releases, options)
)(ReleasesList)
