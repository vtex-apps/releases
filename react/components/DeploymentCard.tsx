import { addIndex, map } from 'ramda'
import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import ReactTooltip from 'react-tooltip'
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
      const key = deployment.date + author.username + index
      return (
        <div key={key} className="pl2">
          <img
            data-tip
            data-for={key}
            className="br-pill"
            src={author.gravatarURL}
          />
          <ReactTooltip id={key} effect='solid' place='bottom'>
            <span>{author.username}</span>
          </ReactTooltip>
        </div>
      )
    }, deployment.authors)

    return (
      <div className="flex-auto b--silver ba br3 pa5 ph7-ns pv7-ns">
        <div className="w-100 flex flex-column flex-row-ns justify-between pb4 pb0-ns">
          <span className="fw4 f4 f3-ns near-black">
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
            <div className="flex flex-row items-center nr6-ns">
              <GithubIcon />
              <span className="dn-s db-ns pl3 f5 near-black">{commitText}</span>
              <span className="dn-ns pl3 f5 near-black">{deployment.commitsTotal}</span>
              <div className="w4 nr5 nr0-ns">
                <Button variation='tertiary' onClick={this.onExpandClick}>
                  {isOpen
                    ? <FormattedMessage id="releases.card.button.collapse" />
                    : <FormattedMessage id="releases.card.button.expand" />
                  }
                </Button>
              </div>
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
          <li key={commit.title + index}>- {commit.title}</li>
        )
      }, deployment.commits)
      : []

    const dependencies = deployment.dependencies
      ? mapDependenciesWithIndex((dependency: Dependency, index: number) => {
        return (
          <div key={dependency.name + dependency.version + index} className="dib">
            <div className="br-pill pv2 ph3 bg-muted-5 ma2 f6"  style={{ wordBreak: 'break-all' }} >
                 {dependency.name} - {dependency.version}
            </div>
          </div>
        )
      }, deployment.dependencies)
      : []

    return (
      <div className="w-100 flex flex-column near-black pt4">
        <div className="w-100 pt6-ns">
          <span className="f6 fw7">Commits</span>
          <div className="w-100 pt4-ns pv4 pb6-ns code lh-copy f6">
            <ul className="pa0 ma0 list">
              {commits}
            </ul>
          </div>
        </div>
        <div className="w-100">
          <div className="pb3">
            <span className="f6 fw7">
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
