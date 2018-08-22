import { addIndex, map } from 'ramda'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { withApollo, WithApolloClient } from 'react-apollo'
import { Button, Spinner } from 'vtex.styleguide'

import GithubIcon from '../icons/GithubIcon'
import ReleaseDetails from '../queries/ReleaseDetails.graphql'
import Badge from './Badge'

interface DeploymentCardProps {
  deployment: Deployment
}

interface DeploymentCardState {
  deployment: Deployment
  isLoading: boolean
  isOpen: boolean
}

interface ReleaseDetailsData {
  releaseDetails: Release
}

const mapAuthorWithIndex = addIndex<Author>(map)
const mapCommitsWithIndex = addIndex<Commit>(map)
const mapDependenciesWithIndex = addIndex<Dependency>(map)

class DeploymentCard extends Component<WithApolloClient<DeploymentCardProps>, DeploymentCardState> {
  constructor(props: any) {
    super(props)

    this.state = {
      deployment: props.deployment,
      isLoading: false,
      isOpen: false
    }
  }

  public render() {
    const { deployment, isLoading, isOpen } = this.state
    const isBeta = deployment.environment === 'beta'
    const badgeBgColor = isBeta ? 'bg-white ba b--rebel-pink' : 'bg-rebel-pink'
    const badgeColor = isBeta ? 'rebel-pink' : 'white'
    const commitText = deployment.commitsTotal === 0
      ? <FormattedMessage id="releases.card.nocommits" />
      : `${deployment.commitsTotal} commit${deployment.commitsTotal > 1 ? 's' : ''}`

    const authors = mapAuthorWithIndex((author: Author, index: number) => {
      return (
        <div key={author.username + index} className="pl2">
          <img className="br-pill" src={author.gravatarURL} />
        </div>
      )
    }, deployment.authors)

    return (
      <div className="flex-auto b--silver ba br3 pa5 ph7-ns pv6-ns">
        <div className="w-100 flex flex-column flex-row-ns justify-between pb4 pb0-ns">
          <span className="fw4 f3 near-black">
            {deployment.appName}
          </span>
          <div className="pt4 pt0-ns">
            <Badge className={`${badgeBgColor} ${badgeColor}`}>
              {deployment.environment}
            </Badge>
            <Badge className={"ml3 near-black ba b--near-black"}>
              {deployment.version}
            </Badge>
          </div>
        </div>
        <div className="w-100 mt4">
          <div className="w-100 flex flex-row justify-between items-center">
            <div className="flex flex-row">
              {authors}
            </div>
            <div className="flex flex-row items-center">
              <GithubIcon />
              <span className="dn-s db-ns pl3 f5 near-black">{commitText}</span>
              <span className="dn-ns pl3 f5 near-black">{deployment.commitsTotal}</span>
              <Button variation='tertiary' onClick={this.onExpandClick}>
                {isOpen
                  ? <FormattedMessage id="releases.card.button.collapse" />
                  : <FormattedMessage id="releases.card.button.expand" />
                }
              </Button>
            </div>
          </div>
          {isOpen
            ? (isLoading ? this.renderLoading() : this.renderDetails())
            : null
          }
        </div>
      </div>
    )
  }

  private getDeploymentDetails = () => {
    const { client } = this.props
    const { deployment } = this.state

    client.query<ReleaseDetailsData>({
      query: ReleaseDetails,
      variables: {
        appName: deployment.appName,
        cacheId: deployment.cacheId
      }
    }).then((data) => {
      const { dependencies, commits } = data.data.releaseDetails
      const deploymentDetail = { dependencies, commits }

      this.setState((prevState) => {
        return ({
          ...prevState,
          deployment: {
            ...prevState.deployment,
            ...deploymentDetail
          },
          isLoading: false
        })
      })
    })
  }

  private onExpandClick = () => {
    this.setState((prevState) => { 
      const isOpen = !prevState.isOpen
      const isLoading = isOpen

      if (isOpen) {
        this.getDeploymentDetails()
      }
      return ({ ...prevState, isOpen, isLoading })
    })
  }

  private renderLoading = () => {
    return (
      <div className="w-100 ph3 pt2 pb4 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  private renderDetails = () => {
    const { deployment } = this.state
    const commits = deployment.commits
      ? mapCommitsWithIndex((commit: Commit, index: number) => {
        return (
          <li key={commit.title + index}>{commit.title}</li>
        )
      }, deployment.commits)
      : []

    const dependencies = deployment.dependencies
      ? mapDependenciesWithIndex((dependency: Dependency, index: number) => {
        return (
          <div key={dependency.name + dependency.version + index} className="pr2 pb2 dib">
            <Badge>
              {dependency.name} - {dependency.version}
            </Badge>
          </div>
        )
      }, deployment.dependencies)
      : []

    return (
      <div className="w-100 ph3 pt2 pb4 flex flex-column near-black">
        <div className="w-100">
          <span className="f5 underline">Commits</span>
          <div className="w-100 pb3">
            <ul>
              {commits}
            </ul>
          </div>
        </div>
        <div className="w-100">
          <div className="pb3">
            <span className="f5 underline">
              <FormattedMessage id="releases.card.dependencies" />
            </span>
          </div>
          <div className="w-100">
            {dependencies}
          </div>
        </div>
      </div>
    )
  }
}

export default withApollo(DeploymentCard)