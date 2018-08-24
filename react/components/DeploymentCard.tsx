import { addIndex, map } from 'ramda'
import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { Badge, IconCaretRight, Spinner } from 'vtex.styleguide'

import GithubIcon from '../icons/GithubIcon'
import ReleaseDetails from '../queries/ReleaseDetails.graphql'

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
    const authors = mapAuthorWithIndex((author: Author, index: number) => {
      return (
        <div key={author.username + index} className="pl2">
          <img className="br-pill" src={author.gravatarURL} />
        </div>
      )
    }, deployment.authors)

    return (
      <div className="flex flex-column w-50-ns mw7">
        <div className="flex flex-row justify-between w-100 bg-white pv3 ph5 br2 br--top">
          <div className="flex align-start">
            <span className={'f3 fw5 blue'}>{deployment.appName}</span>
          </div>
          <div className="flex align-end">
            <div className="pr2">
              <Badge>
                <span className="f5">{deployment.version}</span>
              </Badge>
            </div>
            <div className="pl2">
              <Badge bgColor={`${deployment.environment === 'beta' ? '#727273' : '#368df7'}`} color={'#fff'}>
                <span className="f5">{deployment.environment}</span>
              </Badge>
            </div>
          </div>
        </div>
        <div
          className="flex flex-column justify-center br2 br--bottom bg-light-blue ph3 pointer"
          onClick={this.onClickCard}
        >
          <div className="flex flex-row justify-between items-center h3">
            <div className="h-100 flex items-center align-start">
              {authors}
              <div className="pl3">
                <Badge>
                  <div className="flex flex-row items-center">
                    <GithubIcon /><span className="pl3 f5">{deployment.commitsTotal === 0 ? 'No new commits' : deployment.commitsTotal}</span>
                  </div>
                </Badge>
              </div>
            </div>
            <div className="h-100 align-end flex items-center pr3">
              <div
                style={{
                  animationDuration: '0.333s',
                  transform: `rotate(${isOpen ? '90deg' : '0deg'})`,
                  transition: 'transform 0.333s ease'
                }}
              >
                <IconCaretRight />
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

  private onClickCard = () => {
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
      <div className="w-100 ph3 pt2 pb4 flex flex-column">
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
            <span className="f5 underline">Dependencies</span>
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